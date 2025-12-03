import { Ghost, AlertTriangle, Radio, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmfBar } from './EmfBar';
import { useAppStore } from '@/lib/store';

interface GhostActivityMonitorProps {
  onTriggerHunt: () => void;
}

export function GhostActivityMonitor({ onTriggerHunt }: GhostActivityMonitorProps) {
  const { triggerEffect, emfLevel } = useAppStore();

  const handleTriggerHunt = () => {
    triggerEffect('hunt');
    onTriggerHunt();
  };

  return (
    <div className="phasmo-card" data-testid="ghost-activity-monitor">
      <div className="flex justify-between items-center mb-4">
        <h2 className="phasmo-subtitle text-lg font-orbitron flex items-center gap-2">
          <Radio className="w-5 h-5" />
          GHOST ACTIVITY MONITOR
        </h2>
        <div className="flex items-center gap-2">
          {emfLevel >= 4 && (
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
          )}
          <Ghost className={`w-6 h-6 ${emfLevel >= 3 ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
        </div>
      </div>

      <EmfBar />

      <div className="mt-6 space-y-3">
        <Button
          onClick={handleTriggerHunt}
          className="w-full bg-red-900/80 hover:bg-red-800 border-red-500 text-white font-orbitron uppercase tracking-wider"
          data-testid="button-trigger-hunt"
        >
          <Skull className="w-4 h-4 mr-2" />
          Trigger Hunt Event (Global)
        </Button>
        
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerEffect('flicker')}
            className="font-jetbrains text-xs"
            data-testid="button-flicker"
          >
            Flicker
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerEffect('manifest')}
            className="font-jetbrains text-xs"
            data-testid="button-manifest"
          >
            Manifest
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerEffect('slam')}
            className="font-jetbrains text-xs"
            data-testid="button-slam"
          >
            Slam
          </Button>
        </div>
      </div>
    </div>
  );
}
