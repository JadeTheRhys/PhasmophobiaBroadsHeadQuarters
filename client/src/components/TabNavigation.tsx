import { Button } from '@/components/ui/button';
import { MessageCircle, Fingerprint, BookOpen, FolderOpen, Users, User } from 'lucide-react';
import { useAppStore } from '@/lib/store';

type TabId = 'chat' | 'evidence' | 'ghost' | 'cases' | 'squad' | 'profile';

interface TabConfig {
  id: TabId;
  label: string;
  icon: typeof MessageCircle;
}

const TABS: TabConfig[] = [
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'evidence', label: 'Evidence', icon: Fingerprint },
  { id: 'ghost', label: 'Ghost Profile', icon: BookOpen },
  { id: 'cases', label: 'Cases', icon: FolderOpen },
  { id: 'squad', label: 'Squad', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
];

export function TabNavigation() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2 justify-center" data-testid="tab-navigation">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={`font-orbitron text-xs uppercase tracking-wider ${
              isActive 
                ? 'bg-primary text-primary-foreground border-accent shadow-neon-purple' 
                : 'bg-background/50 border-primary text-accent hover:bg-primary/20'
            }`}
            data-testid={`tab-button-${tab.id}`}
          >
            <Icon className="w-4 h-4 mr-1.5" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
