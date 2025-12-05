import { useState } from 'react';
import { Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { JitsiTroubleshootingModal } from './JitsiTroubleshootingModal';

interface VideoCallButtonProps {
  roomName?: string;
}

export function VideoCallButton({ roomName = "PhasmoBroadsHQ" }: VideoCallButtonProps) {
  const [isRinging, setIsRinging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { displayName } = useAppStore();

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleProceedToCall = () => {
    setIsModalOpen(false);
    setIsRinging(true);
    
    // Build the Jitsi URL with display name
    const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(displayName || 'GhostHunter')}"`;
    
    // Open Jitsi in a new browser tab/window
    setTimeout(() => {
      window.open(jitsiUrl, '_blank', 'noopener,noreferrer');
      setIsRinging(false);
    }, 1500);
  };

  return (
    <>
      <JitsiTroubleshootingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onProceed={handleProceedToCall}
      />
      <Button
        onClick={handleButtonClick}
        disabled={isRinging}
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

      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
