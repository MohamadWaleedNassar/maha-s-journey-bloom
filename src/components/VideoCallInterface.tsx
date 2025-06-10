
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Phone, Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoCallInterfaceProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  localLabel: string;
  remoteLabel: string;
  callStatus: string;
  error?: string;
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  localStream,
  remoteStream,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onEndCall,
  localLabel,
  remoteLabel,
  callStatus,
  error,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localVideoError, setLocalVideoError] = useState<string | null>(null);
  const [remoteVideoError, setRemoteVideoError] = useState<string | null>(null);

  useEffect(() => {
    const setupLocalVideo = async () => {
      if (localVideoRef.current && localStream) {
        try {
          console.log('Setting up local video with stream:', localStream);
          localVideoRef.current.srcObject = localStream;
          
          // Ensure video plays
          localVideoRef.current.onloadedmetadata = () => {
            console.log('Local video metadata loaded');
            localVideoRef.current?.play().catch(e => {
              console.error('Error playing local video:', e);
              setLocalVideoError('Failed to play video');
            });
          };

          // Handle video errors
          localVideoRef.current.onerror = (e) => {
            console.error('Local video error:', e);
            setLocalVideoError('Video playback error');
          };

          setLocalVideoError(null);
        } catch (error) {
          console.error('Error setting up local video:', error);
          setLocalVideoError('Failed to setup video');
        }
      }
    };

    setupLocalVideo();
  }, [localStream]);

  useEffect(() => {
    const setupRemoteVideo = async () => {
      if (remoteVideoRef.current && remoteStream) {
        try {
          console.log('Setting up remote video with stream:', remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
          
          // Ensure video plays
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log('Remote video metadata loaded');
            remoteVideoRef.current?.play().catch(e => {
              console.error('Error playing remote video:', e);
              setRemoteVideoError('Failed to play video');
            });
          };

          // Handle video errors
          remoteVideoRef.current.onerror = (e) => {
            console.error('Remote video error:', e);
            setRemoteVideoError('Video playback error');
          };

          setRemoteVideoError(null);
        } catch (error) {
          console.error('Error setting up remote video:', error);
          setRemoteVideoError('Failed to setup video');
        }
      }
    };

    setupRemoteVideo();
  }, [remoteStream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-lilac-50 p-4">
      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {callStatus}
            </Badge>
            <span className="text-gray-600">Video Call</span>
          </div>
          
          <Button
            onClick={onEndCall}
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
              <CardTitle className="text-lg">{localLabel}</CardTitle>
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
                {(!isVideoEnabled || localVideoError) && (
                  <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                    <VideoOff size={48} className="text-white mb-2" />
                    <span className="text-white text-sm">
                      {localVideoError || 'Camera disabled'}
                    </span>
                  </div>
                )}
                {!localStream && (
                  <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    <span className="text-white text-sm">Accessing camera...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remote Video */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{remoteLabel}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!remoteStream && (
                  <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                    <Users size={48} className="text-white mb-2" />
                    <span className="text-white text-sm">Waiting for connection...</span>
                  </div>
                )}
                {remoteVideoError && (
                  <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                    <VideoOff size={48} className="text-white mb-2" />
                    <span className="text-white text-sm">{remoteVideoError}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onToggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </Button>
          
          <Button
            onClick={onToggleAudio}
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
};

export default VideoCallInterface;
