import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { User, Save, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { GitHubLogin } from '@/components/GitHubLogin';

// Get base URL for assets (handles GitHub Pages deployment)
const BASE_URL = import.meta.env.BASE_URL || '/';

// Profile avatar options using case file images
const AVATAR_OPTIONS = [
  { id: 'hunter1', filename: 'case1_1764775148686.jpg', label: 'Hunter 1' },
  { id: 'hunter2', filename: 'case2_1764775148687.jpg', label: 'Hunter 2' },
  { id: 'hunter3', filename: 'case3_1764775148687.jpg', label: 'Hunter 3' },
  { id: 'hunter4', filename: 'case4_1764775148688.jpg', label: 'Hunter 4' },
  { id: 'hunter5', filename: 'case5_1764775148688.jpg', label: 'Hunter 5' },
  { id: 'hunter6', filename: 'case6_1764775148688.jpg', label: 'Hunter 6' },
].map(avatar => ({
  ...avatar,
  url: `${BASE_URL}assets/${avatar.filename}`
}));

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

        <Separator className="my-6" />

        <div className="space-y-3">
          <h4 className="text-md font-orbitron text-primary flex items-center gap-2">
            GitHub Authentication
          </h4>
          <GitHubLogin />
        </div>
      </div>
    </div>
  );
}
