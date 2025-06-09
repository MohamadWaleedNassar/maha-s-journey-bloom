
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneCall, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoCall as VideoCallType } from '@/lib/types';

const VideoCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>('waiting');
  const [activeCalls, setActiveCalls] = useState<VideoCallType[]>([]);
  const [currentCall, setCurrentCall] = useState<VideoCallType | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
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
      }, () => {
        fetchActiveCalls();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: 'Camera/Microphone Error',
        description: 'Unable to access camera or microphone',
        variant: 'destructive'
      });
    }
  };

  const startCall = async () => {
    setCallStatus('connecting');
    
    try {
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
      await startLocalVideo();
      setIsCallActive(true);
      setCallStatus('connected');
      
      toast({
        title: 'Call Started',
        description: 'Waiting for admin to join...'
      });
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
      const { error } = await supabase
        .from('video_calls')
        .update({ status: 'active' })
        .eq('id', call.id);

      if (error) throw error;

      await startLocalVideo();
      setIsCallActive(true);
      setCallStatus('connected');
      
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

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    setIsCallActive(false);
    setCurrentCall(null);
    setCallStatus('waiting');
    
    toast({
      title: 'Call Ended',
      description: 'The video call has been ended'
    });
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  if (isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-lilac-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Connected
              </Badge>
              <span className="text-gray-600">Call with Care Team</span>
            </div>
            
            <Button
              onClick={endCall}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
            >
              <Phone size={16} className="mr-2" />
              End Call
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Local Video */}
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">You (Maha)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff size={48} className="text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Remote Video */}
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Care Team</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <Users size={48} className="text-white" />
                    <span className="text-white ml-2">Waiting for connection...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleVideo}
              variant={isVideoEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>
            
            <Button
              onClick={toggleAudio}
              variant={isAudioEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>
          </div>
        </div>
      </div>
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
