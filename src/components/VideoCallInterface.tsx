
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Phone, Users } from 'lucide-react';

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
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-lilac-50 p-4">
      <div className="max-w-6xl mx-auto">
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
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <Users size={48} className="text-white" />
                    <span className="text-white ml-2">Waiting for connection...</span>
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
