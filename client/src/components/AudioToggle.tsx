import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { scarySoundService } from '@/lib/scarySounds';

/**
 * Audio Toggle Button Component
 * 
 * Provides accessibility control to mute/unmute scary sound effects.
 * State persists across sessions via localStorage.
 */
export function AudioToggle() {
  const [isMuted, setIsMuted] = useState(scarySoundService.getMuteState());

  useEffect(() => {
    // Sync with service on mount
    setIsMuted(scarySoundService.getMuteState());
  }, []);

  const handleToggle = () => {
    const newMuteState = scarySoundService.toggleMute();
    setIsMuted(newMuteState);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="text-accent hover:bg-primary/20"
      title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      data-testid="audio-toggle"
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Volume2 className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
