import { useAppStore } from '@/lib/store';

export function Header() {
  const { userId, displayName } = useAppStore();

  return (
    <div className="phasmo-card text-center py-6" data-testid="header">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase font-orbitron phasmo-title mb-2 tracking-widest">
        Phasmophobia Broads HQ
      </h1>
      <p className="text-sm text-muted-foreground font-jetbrains mt-2">
        Level 5 Command Center // STATUS:{' '}
        <span className="text-accent text-glow-cyan" data-testid="text-user-status">
          {userId ? `ONLINE — ${displayName}` : 'AWAITING AUTHORIZATION...'}
        </span>
      </p>
    </div>
  );
}
