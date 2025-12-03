import { useAppStore } from '@/lib/store';

const EMF_COLORS = [
  'bg-green-500',
  'bg-green-400',
  'bg-yellow-400',
  'bg-orange-500',
  'bg-red-500',
  'bg-red-600'
];

const EMF_LABELS = ['OFF', '1', '2', '3', '4', '5'];

export function EmfBar() {
  const { emfLevel } = useAppStore();
  const width = (emfLevel / 5) * 100;
  const colorClass = EMF_COLORS[emfLevel] || EMF_COLORS[0];

  return (
    <div className="space-y-2" data-testid="emf-bar">
      <div className="flex justify-between items-center">
        <span className="text-xs font-jetbrains text-muted-foreground uppercase tracking-wider">
          EMF Reader
        </span>
        <span 
          className={`text-lg font-orbitron font-bold ${emfLevel >= 4 ? 'text-red-500 text-glow-purple' : 'text-accent text-glow-cyan'}`}
          data-testid="text-emf-level"
        >
          {EMF_LABELS[emfLevel]}
        </span>
      </div>
      
      <div className="emf-bar-container h-5 rounded-md">
        <div
          className={`h-full transition-all duration-300 ease-out ${colorClass} ${emfLevel >= 4 ? 'animate-pulse' : ''}`}
          style={{ width: `${width}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs font-jetbrains text-muted-foreground px-1">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}
