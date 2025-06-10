
export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onIceCandidateCallback: ((candidate: RTCIceCandidate) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    console.log('Initializing peer connection...');
    
    if (this.peerConnection) {
      console.log('Closing existing peer connection');
      this.peerConnection.close();
    }

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);
    this.isInitialized = true;

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.onIceCandidateCallback) {
        console.log('ICE candidate generated:', event.candidate);
        this.onIceCandidateCallback(event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream:', event.streams);
      this.remoteStream = event.streams[0];
      if (this.onRemoteStreamCallback && this.remoteStream) {
        this.onRemoteStreamCallback(this.remoteStream);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
      if (this.peerConnection?.connectionState === 'failed' && this.onErrorCallback) {
        this.onErrorCallback('Connection failed. Please try again.');
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection?.iceConnectionState);
    };

    console.log('Peer connection initialized successfully');
  }

  async checkMediaPermissions(): Promise<{ video: boolean; audio: boolean }> {
    try {
      const permissions = await Promise.all([
        navigator.permissions.query({ name: 'camera' as PermissionName }),
        navigator.permissions.query({ name: 'microphone' as PermissionName })
      ]);

      return {
        video: permissions[0].state === 'granted',
        audio: permissions[1].state === 'granted'
      };
    } catch (error) {
      console.warn('Permission API not supported, will try direct access');
      return { video: false, audio: false };
    }
  }

  async getLocalStream(video: boolean = true, audio: boolean = true): Promise<MediaStream> {
    try {
      console.log('Requesting media access:', { video, audio });
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }

      // Stop any existing local stream
      if (this.localStream) {
        console.log('Stopping existing local stream');
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      const constraints = {
        video: video ? {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      console.log('Getting user media with constraints:', constraints);
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Local stream obtained successfully');
      console.log('Video tracks:', this.localStream.getVideoTracks().length);
      console.log('Audio tracks:', this.localStream.getAudioTracks().length);
      
      // Ensure peer connection is ready
      if (!this.peerConnection || !this.isInitialized) {
        console.log('Reinitializing peer connection for stream');
        this.initializePeerConnection();
      }
      
      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          console.log('Adding track to peer connection:', track.kind);
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
      
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      let errorMessage = 'Failed to access camera and microphone. ';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera and microphone access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera or microphone found.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera or microphone is already in use.';
        } else {
          errorMessage += error.message;
        }
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection || !this.isInitialized) {
      console.error('Peer connection not ready, reinitializing...');
      this.initializePeerConnection();
      
      // Re-add local stream tracks if available
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          if (this.peerConnection && this.localStream) {
            console.log('Re-adding track to new peer connection:', track.kind);
            this.peerConnection.addTrack(track, this.localStream);
          }
        });
      }
    }

    if (!this.peerConnection) {
      throw new Error('Failed to initialize peer connection');
    }

    try {
      console.log('Creating offer...');
      
      // Add a small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Offer created:', offer);
      await this.peerConnection.setLocalDescription(offer);
      console.log('Local description set successfully');
      
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to create call offer. Please try again.');
      }
      throw error;
    }
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection || !this.isInitialized) {
      throw new Error('Peer connection not initialized');
    }

    try {
      console.log('Creating answer for offer:', offer);
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      console.log('Answer created and set as local description:', answer);
      return answer;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection || !this.isInitialized) {
      throw new Error('Peer connection not initialized');
    }

    try {
      console.log('Handling answer:', answer);
      await this.peerConnection.setRemoteDescription(answer);
      console.log('Remote description set successfully');
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection || !this.isInitialized) {
      throw new Error('Peer connection not initialized');
    }

    try {
      console.log('Adding ICE candidate:', candidate);
      await this.peerConnection.addIceCandidate(candidate);
      console.log('ICE candidate added successfully');
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
      // Don't throw here as ICE candidates can fail and it's not always critical
    }
  }

  setOnRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
  }

  setOnIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    this.onIceCandidateCallback = callback;
  }

  setOnError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        console.log('Toggling video:', enabled);
        videoTrack.enabled = enabled;
      }
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        console.log('Toggling audio:', enabled);
        audioTrack.enabled = enabled;
      }
    }
  }

  cleanup() {
    console.log('Cleaning up WebRTC service');
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      this.localStream = null;
    }

    if (this.peerConnection) {
      console.log('Closing peer connection');
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.isInitialized = false;
    this.remoteStream = null;
    this.onRemoteStreamCallback = null;
    this.onIceCandidateCallback = null;
    this.onErrorCallback = null;
  }
}
