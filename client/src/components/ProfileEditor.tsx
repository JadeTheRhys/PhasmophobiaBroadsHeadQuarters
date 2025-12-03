import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Save, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

const AVATAR_OPTIONS = [
  { id: 'ghost1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost1&backgroundColor=b71cff', label: 'Ghost 1' },
  { id: 'ghost2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost2&backgroundColor=5dfdff', label: 'Ghost 2' },
  { id: 'ghost3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost3&backgroundColor=ff5d5d', label: 'Ghost 3' },
  { id: 'hunter1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=hunter1&backgroundColor=22c55e', label: 'Hunter 1' },
  { id: 'hunter2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=hunter2&backgroundColor=eab308', label: 'Hunter 2' },
  { id: 'hunter3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=hunter3&backgroundColor=f97316', label: 'Hunter 3' },
];

interface ProfileEditorProps {
  onSave?: (displayName: string, photoUrl: string) => void;
}

export function ProfileEditor({ onSave }: ProfileEditorProps) {
  const { displayName: currentName, photoUrl: currentPhoto, setUser, userId } = useAppStore();
  const [displayName, setDisplayName] = useState(currentName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentPhoto || AVATAR_OPTIONS[0].url);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (displayName.trim().length < 3) {
      toast({
        title: "Invalid Name",
        description: "Display name must be at least 3 characters.",
        variant: "destructive"
      });
      return;
    }

    setUser(userId, displayName.trim(), selectedAvatar);
    onSave?.(displayName.trim(), selectedAvatar);
    setIsSaved(true);
    
    toast({
      title: "Profile Updated",
      description: "Your hunter profile has been saved.",
    });

    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6" data-testid="profile-editor">
      <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
        <User className="w-5 h-5" />
        Hunter Profile
      </h3>

      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-2 border-accent">
          <AvatarImage src={selectedAvatar} alt="Profile" />
          <AvatarFallback className="bg-primary/20 text-accent font-orbitron">
            {displayName.slice(0, 2).toUpperCase() || 'GH'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-foreground font-orbitron text-lg">
            {displayName || 'Ghost Hunter'}
          </p>
          <p className="text-xs text-muted-foreground font-jetbrains">
            ID: {userId || 'Not authenticated'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name" className="text-sm font-jetbrains text-primary">
            Display Name
          </Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your hunter name"
            className="bg-background/50 border-primary focus:border-accent text-foreground font-jetbrains"
            data-testid="input-display-name"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-jetbrains text-primary">
            Select Avatar
          </Label>
          <RadioGroup
            value={selectedAvatar}
            onValueChange={setSelectedAvatar}
            className="grid grid-cols-3 gap-3"
          >
            {AVATAR_OPTIONS.map((avatar) => (
              <div key={avatar.id} className="relative">
                <RadioGroupItem
                  value={avatar.url}
                  id={avatar.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={avatar.id}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAvatar === avatar.url
                      ? 'border-accent bg-accent/10'
                      : 'border-primary/30 hover:border-primary bg-background/30'
                  }`}
                  data-testid={`avatar-option-${avatar.id}`}
                >
                  <Avatar className="w-12 h-12 mb-1">
                    <AvatarImage src={avatar.url} alt={avatar.label} />
                    <AvatarFallback>{avatar.label.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-jetbrains text-muted-foreground">
                    {avatar.label}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          onClick={handleSave}
          className="w-full font-orbitron uppercase tracking-wider"
          data-testid="button-save-profile"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
