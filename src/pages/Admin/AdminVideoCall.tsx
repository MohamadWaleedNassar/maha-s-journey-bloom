import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, Users, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoCall as VideoCallType } from '@/lib/types';
import { WebRTCService } from '@/lib/webrtc';
import VideoCallInterface from '@/components/VideoCallInterface';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminVideoCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>('waiting');
  const [activeCalls, setActiveCalls] = useState<VideoCallType[]>([]);
  const [currentCall, setCurrentCall] = useState<VideoCallType | null>(null);
  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveCalls();
    
    // Set up real-time subscription for video calls
    const channel = supabase
      .channel('admin-video-calls')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_calls'
      }, (payload) => {
        console.log('Video call update:', payload);
        fetchActiveCalls();
        handleSignalingMessage(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Separate useEffect for WebRTC cleanup - only cleanup when component unmounts or call ends
  useEffect(() => {
    return () => {
      if (webrtcService && !isCallActive) {
        console.log('Component unmounting - cleaning up WebRTC');
        webrtcService.cleanup();
      }
    };
  }, [webrtcService, isCallActive]);

  const handleSignalingMessage = async (payload: any) => {
    if (!webrtcService || !currentCall) return;

    const { new: newRecord } = payload;
    
    if (newRecord && newRecord.room_id === currentCall.room_id && newRecord.signaling_data) {
      try {
        const signalingDataString = typeof newRecord.signaling_data === 'string' 
          ? newRecord.signaling_data 
          : JSON.stringify(newRecord.signaling_data);
        const signalingData = JSON.parse(signalingDataString);
        
        if (signalingData.type === 'offer' && newRecord.started_by !== 'admin') {
          console.log('Received offer from patient');
          const answer = await webrtcService.createAnswer(signalingData);
          
          // Send answer back using raw SQL update
          const { error } = await (supabase as any).rpc('update_signaling_data', {
            call_id: currentCall.id,
            data: answer
          });
          
          if (error) {
            console.error('Error sending answer:', error);
          }
        } else if (signalingData.type === 'answer' && newRecord.started_by !== 'admin') {
          console.log('Received answer from patient');
          await webrtcService.handleAnswer(signalingData);
        } else if (signalingData.type === 'ice-candidate') {
          console.log('Received ICE candidate');
          await webrtcService.addIceCandidate(signalingData.candidate);
        }
      } catch (error) {
        console.error('Error handling signaling:', error);
        setError('Error in call signaling. Please try again.');
      }
    }
  };

  const fetchActiveCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .neq('status', 'ended')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveCalls((data || []).map(item => ({
        ...item,
        status: item.status as 'waiting' | 'active' | 'ended',
        started_by: item.started_by as 'patient' | 'admin'
      })));
    } catch (error: any) {
      console.error('Error fetching calls:', error);
      setError('Failed to load calls. Please refresh the page.');
    }
  };

  const initializeWebRTC = () => {
    console.log('Initializing WebRTC service');
    const service = new WebRTCService();
    
    service.setOnRemoteStream((stream) => {
      console.log('Received remote stream');
      setRemoteStream(stream);
      setCallStatus('connected');
      setError(null);
    });

    service.setOnIceCandidate(async (candidate) => {
      console.log('Sending ICE candidate');
      if (currentCall) {
        const { error } = await (supabase as any).rpc('update_signaling_data', {
          call_id: currentCall.id,
          data: {
            type: 'ice-candidate',
            candidate: candidate
          }
        });
        
        if (error) {
          console.error('Error sending ICE candidate:', error);
        }
      }
    });

    service.setOnError((errorMessage) => {
      console.error('WebRTC error:', errorMessage);
      setError(errorMessage);
      setIsStartingCall(false);
      setCallStatus('waiting');
    });

    setWebrtcService(service);
    console.log('WebRTC service initialized and stored');
    return service;
  };

  const startCall = async () => {
    setCallStatus('connecting');
    setIsStartingCall(true);
    setError(null);
    
    try {
      console.log('Starting call - initializing WebRTC');
      const service = initializeWebRTC();
      
      // Check permissions first
      const permissions = await service.checkMediaPermissions();
      console.log('Media permissions:', permissions);
      
      console.log('Getting local stream');
      const stream = await service.getLocalStream(isVideoEnabled, isAudioEnabled);
      setLocalStream(stream);
      console.log('Local stream set successfully');

      const roomId = `admin-call-${Date.now()}`;
      
      console.log('Creating call record in database');
      const { data, error } = await supabase
        .from('video_calls')
        .insert({
          room_id: roomId,
          started_by: 'admin',
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      const newCall = {
        ...data,
        status: data.status as 'waiting' | 'active' | 'ended',
        started_by: data.started_by as 'patient' | 'admin'
      };

      setCurrentCall(newCall);
      setIsCallActive(true);
      setIsStartingCall(false);
      
      console.log('Call created successfully, preparing to send offer');
      
      toast({
        title: 'Call Started',
        description: 'Waiting for Maha to join...'
      });

      // Create and send offer after a short delay to ensure everything is set up
      setTimeout(async () => {
        try {
          console.log('Creating offer...');
          if (!service) {
            throw new Error('WebRTC service not available');
          }
          
          const offer = await service.createOffer();
          console.log('Offer created successfully:', offer);
          
          const { error: updateError } = await (supabase as any).rpc('update_signaling_data', {
            call_id: data.id,
            data: offer
          });
          
          if (updateError) {
            console.error('Error sending offer:', updateError);
            setError('Failed to establish connection. Please try again.');
          } else {
            console.log('Offer sent successfully');
            await supabase
              .from('video_calls')
              .update({ status: 'active' })
              .eq('id', data.id);
          }
        } catch (error) {
          console.error('Error creating offer:', error);
          setError('Failed to create call offer. Please try again.');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('Error starting call:', error);
      setError(error.message || 'Failed to start call. Please check your camera and microphone permissions.');
      setCallStatus('waiting');
      setIsStartingCall(false);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to start call',
        variant: 'destructive'
      });
    }
  };

  const joinCall = async (call: VideoCallType) => {
    setCallStatus('connecting');
    setCurrentCall(call);
    setError(null);
    
    try {
      const service = initializeWebRTC();
      const stream = await service.getLocalStream(isVideoEnabled, isAudioEnabled);
      setLocalStream(stream);

      const { error } = await supabase
        .from('video_calls')
        .update({ status: 'active' })
        .eq('id', call.id);

      if (error) throw error;

      setIsCallActive(true);
      
      toast({
        title: 'Joined Call',
        description: 'Connected with Maha successfully!'
      });
    } catch (error: any) {
      setError(error.message || 'Failed to join call');
      toast({
        title: 'Error',
        description: `Failed to join call: ${error.message}`,
        variant: 'destructive'
      });
      setCallStatus('waiting');
    }
  };

  const endCall = async () => {
    console.log('Ending call');
    
    if (currentCall) {
      try {
        await supabase
          .from('video_calls')
          .update({ 
            status: 'ended',
            ended_at: new Date().toISOString()
          })
          .eq('id', currentCall.id);
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }

    if (webrtcService) {
      console.log('Cleaning up WebRTC service');
      webrtcService.cleanup();
      setWebrtcService(null);
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setCurrentCall(null);
    setCallStatus('waiting');
    setError(null);
    
    toast({
      title: 'Call Ended',
      description: 'The video call has been ended'
    });
  };

  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    if (webrtcService) {
      webrtcService.toggleVideo(newState);
    }
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (webrtcService) {
      webrtcService.toggleAudio(newState);
    }
  };

  if (isCallActive) {
    return (
      <VideoCallInterface
        localStream={localStream}
        remoteStream={remoteStream}
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onEndCall={endCall}
        localLabel="You (Care Team)"
        remoteLabel="Maha"
        callStatus={callStatus === 'connected' ? "Connected" : "Connecting..."}
        error={error || undefined}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Video Call Management</h1>
        <p className="text-gray-600">Connect with Maha through secure video calls</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start New Call */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
              <PhoneCall className="text-purple-600" />
              Start New Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Initiate a video call with Maha. She will be notified and can join when ready.
            </p>
            <Button 
              onClick={startCall}
              disabled={isStartingCall || callStatus === 'connecting'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isStartingCall ? 'Starting Call...' : 'Start Video Call with Maha'}
            </Button>
          </CardContent>
        </Card>

        {/* Active Calls */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
              <Users className="text-blue-600" />
              Pending Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCalls.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending calls</p>
            ) : (
              <div className="space-y-3">
                {activeCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        Call from {call.started_by === 'patient' ? 'Maha' : 'Care Team'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        Started {new Date(call.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={call.status === 'waiting' ? 'outline' : 'default'}>
                        {call.status}
                      </Badge>
                      {call.started_by === 'patient' && (
                        <Button
                          size="sm"
                          onClick={() => joinCall(call)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Join Call
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call Features */}
      <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-purple-800 mb-2">Video Call Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• High-quality video and audio communication</li>
            <li>• Secure, encrypted calls for privacy</li>
            <li>• Real-time connection status updates</li>
            <li>• Easy camera and microphone controls</li>
            <li>• Notifications when Maha starts a call</li>
            <li>• Allow camera and microphone access when prompted</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVideoCall;
