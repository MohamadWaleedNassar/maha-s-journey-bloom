import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoCall as VideoCallType } from '@/lib/types';
import { WebRTCService } from '@/lib/webrtc';
import VideoCallInterface from '@/components/VideoCallInterface';

const VideoCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>('waiting');
  const [activeCalls, setActiveCalls] = useState<VideoCallType[]>([]);
  const [currentCall, setCurrentCall] = useState<VideoCallType | null>(null);
  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveCalls();
    
    // Set up real-time subscription for video calls
    const channel = supabase
      .channel('video-calls')
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
      if (webrtcService) {
        webrtcService.cleanup();
      }
    };
  }, [webrtcService, currentCall]);

  const handleSignalingMessage = async (payload: any) => {
    if (!webrtcService || !currentCall) return;

    const { new: newRecord, eventType } = payload;
    
    if (newRecord && newRecord.room_id === currentCall.room_id && newRecord.signaling_data) {
      try {
        const signalingDataString = typeof newRecord.signaling_data === 'string' 
          ? newRecord.signaling_data 
          : JSON.stringify(newRecord.signaling_data);
        const signalingData = JSON.parse(signalingDataString);
        
        if (signalingData.type === 'offer' && newRecord.started_by !== 'patient') {
          console.log('Received offer from admin');
          const answer = await webrtcService.createAnswer(signalingData);
          
          // Send answer back using raw SQL update
          const { error } = await supabase.rpc('update_signaling_data', {
            call_id: currentCall.id,
            data: answer
          });
          
          if (error) {
            console.error('Error sending answer:', error);
          }
        } else if (signalingData.type === 'answer' && newRecord.started_by !== 'patient') {
          console.log('Received answer from admin');
          await webrtcService.handleAnswer(signalingData);
        } else if (signalingData.type === 'ice-candidate') {
          console.log('Received ICE candidate');
          await webrtcService.addIceCandidate(signalingData.candidate);
        }
      } catch (error) {
        console.error('Error handling signaling:', error);
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
    }
  };

  const initializeWebRTC = () => {
    const service = new WebRTCService();
    
    service.setOnRemoteStream((stream) => {
      console.log('Received remote stream');
      setRemoteStream(stream);
      setCallStatus('connected');
    });

    service.setOnIceCandidate(async (candidate) => {
      console.log('Sending ICE candidate');
      if (currentCall) {
        const { error } = await supabase.rpc('update_signaling_data', {
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

    setWebrtcService(service);
    return service;
  };

  const startCall = async () => {
    setCallStatus('connecting');
    
    try {
      const service = initializeWebRTC();
      const stream = await service.getLocalStream(isVideoEnabled, isAudioEnabled);
      setLocalStream(stream);

      const roomId = `call-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('video_calls')
        .insert({
          room_id: roomId,
          started_by: 'patient',
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCall({
        ...data,
        status: data.status as 'waiting' | 'active' | 'ended',
        started_by: data.started_by as 'patient' | 'admin'
      });

      setIsCallActive(true);
      
      toast({
        title: 'Call Started',
        description: 'Waiting for admin to join...'
      });

      // Create and send offer when admin joins
      setTimeout(async () => {
        const offer = await service.createOffer();
        const { error: updateError } = await supabase.rpc('update_signaling_data', {
          call_id: data.id,
          data: offer
        });
        
        if (updateError) {
          console.error('Error sending offer:', updateError);
        } else {
          await supabase
            .from('video_calls')
            .update({ status: 'active' })
            .eq('id', data.id);
        }
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to start call: ${error.message}`,
        variant: 'destructive'
      });
      setCallStatus('waiting');
    }
  };

  const joinCall = async (call: VideoCallType) => {
    setCallStatus('connecting');
    setCurrentCall(call);
    
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
        description: 'Connected successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to join call: ${error.message}`,
        variant: 'destructive'
      });
      setCallStatus('waiting');
    }
  };

  const endCall = async () => {
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
      webrtcService.cleanup();
      setWebrtcService(null);
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setCurrentCall(null);
    setCallStatus('waiting');
    
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
        localLabel="You (Maha)"
        remoteLabel="Care Team"
        callStatus={callStatus === 'connected' ? "Connected" : "Connecting..."}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lilac-dark mb-2">Video Call</h1>
        <p className="text-gray-600">Connect with your care team face-to-face</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start New Call */}
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="text-xl text-lilac-dark flex items-center gap-2">
              <PhoneCall className="text-pink" />
              Start New Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Initiate a video call with your care team. They will be notified and can join when available.
            </p>
            <Button 
              onClick={startCall}
              disabled={callStatus === 'connecting'}
              className="w-full bg-pink hover:bg-pink-dark text-white"
            >
              {callStatus === 'connecting' ? 'Starting Call...' : 'Start Video Call'}
            </Button>
          </CardContent>
        </Card>

        {/* Active Calls */}
        <Card className="border-lilac-200">
          <CardHeader>
            <CardTitle className="text-xl text-lilac-dark flex items-center gap-2">
              <Users className="text-lilac" />
              Available Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCalls.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active calls available</p>
            ) : (
              <div className="space-y-3">
                {activeCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Call from {call.started_by === 'patient' ? 'You' : 'Care Team'}</p>
                      <p className="text-sm text-gray-500">
                        Started {new Date(call.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={call.status === 'waiting' ? 'outline' : 'default'}>
                        {call.status}
                      </Badge>
                      {call.started_by !== 'patient' && (
                        <Button
                          size="sm"
                          onClick={() => joinCall(call)}
                          className="bg-lilac hover:bg-lilac-dark text-white"
                        >
                          Join
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

      {/* Instructions */}
      <Card className="mt-6 bg-gradient-to-r from-pink-50 to-lilac-50 border-pink-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lilac-dark mb-2">How Video Calling Works</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click "Start Video Call" to initiate a new call session</li>
            <li>• Your care team will be notified and can join when available</li>
            <li>• You can toggle your camera and microphone during the call</li>
            <li>• Calls are secure and private between you and your care team</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCall;
