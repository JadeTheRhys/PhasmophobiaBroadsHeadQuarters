import { useState } from 'react';
import { Phone, PhoneCall, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';

interface VideoCallButtonProps {
  roomName?: string;
}

export function VideoCallButton({ roomName = "PhasmoBroadsHQ" }: VideoCallButtonProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const { displayName } = useAppStore();

  const handleStartCall = () => {
    setIsRinging(true);
    setTimeout(() => {
      setIsRinging(false);
      setIsCallActive(true);
    }, 1500);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
  };

  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(displayName || 'GhostHunter')}"`;

  return (
    <>
      <Button
        onClick={handleStartCall}
        className={`
          relative overflow-visible
          bg-red-900/80 hover:bg-red-800 
          border-2 border-red-500 
          text-white font-orbitron uppercase tracking-wider
          transition-all duration-300
          ${isRinging ? 'animate-shake' : ''}
        `}
        style={{
          boxShadow: isRinging 
            ? '0 0 30px rgba(239, 68, 68, 0.9), 0 0 60px rgba(239, 68, 68, 0.6), 0 0 90px rgba(239, 68, 68, 0.3)'
            : '0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.3)'
        }}
        data-testid="button-video-call"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isRinging ? (
            <PhoneCall className="w-5 h-5 animate-pulse" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">
            {isRinging ? 'Connecting...' : 'Squad Call'}
          </span>
        </span>
        
        <span 
          className="absolute inset-0 rounded-md opacity-50"
          style={{
            background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        
        <span 
          className="absolute -inset-1 rounded-lg opacity-30 blur-sm"
          style={{
            background: 'linear-gradient(45deg, #ef4444, #dc2626, #ef4444)',
            animation: isRinging ? 'none' : 'glow-pulse 3s ease-in-out infinite'
          }}
        />
      </Button>

      <Dialog open={isCallActive} onOpenChange={setIsCallActive}>
        <DialogContent 
          className="max-w-4xl h-[80vh] p-0 bg-background border-red-500"
          style={{ boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)' }}
        >
          <DialogHeader className="p-4 border-b border-red-500/30 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="font-orbitron text-red-400 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
                Squad Video Call
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-jetbrains text-xs">
                Room: {roomName}
              </DialogDescription>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndCall}
              className="font-orbitron"
              data-testid="button-end-call"
            >
              <X className="w-4 h-4 mr-1" />
              End Call
            </Button>
          </DialogHeader>
          
          <div className="flex-1 h-full min-h-0">
            <iframe
              src={jitsiUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full border-0"
              style={{ minHeight: 'calc(80vh - 80px)' }}
              title="Jitsi Video Call"
            />
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
