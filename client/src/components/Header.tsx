import { useAppStore } from '@/lib/store';
import { Wifi, WifiOff } from 'lucide-react';

export function Header() {
  const { userId, displayName, isFirebaseOnline } = useAppStore();

  return (
    <div className="phasmo-card text-center py-6" data-testid="header">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase font-orbitron phasmo-title mb-2 tracking-widest">
        Phasmophobia Broads HQ
      </h1>
      <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
        <p className="text-sm text-muted-foreground font-jetbrains flex items-center gap-2">
          <span>Firebase:</span>
          {isFirebaseOnline ? (
            <span className="text-status-online flex items-center gap-1" data-testid="text-firebase-status">
              <Wifi className="w-4 h-4" />
              ONLINE
            </span>
          ) : (
            <span className="text-status-offline flex items-center gap-1" data-testid="text-firebase-status">
              <WifiOff className="w-4 h-4" />
              OFFLINE
            </span>
          )}
        </p>
        <span className="text-muted-foreground">|</span>
        <p className="text-sm text-muted-foreground font-jetbrains">
          Agent:{' '}
          <span className="text-accent text-glow-cyan" data-testid="text-user-status">
            {userId ? displayName : 'AWAITING AUTHORIZATION...'}
          </span>
        </p>
      </div>
    </div>
  );
}
