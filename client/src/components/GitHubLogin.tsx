import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { signInWithGitHub, signOut, updateSquadStatus } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { FaGithub } from 'react-icons/fa';
import { LogOut, Mail, User, CheckCircle2 } from 'lucide-react';

export function GitHubLogin() {
  const { 
    isGitHubAuthenticated, 
    gitHubUser, 
    isFirebaseOnline,
    setGitHubAuth, 
    clearGitHubAuth,
    setUser,
    userId
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGitHubSignIn = async () => {
    if (!isFirebaseOnline) {
      toast({
        title: "Offline Mode",
        description: "Firebase is offline. GitHub sign-in requires an online connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const userInfo = await signInWithGitHub();
      
      setGitHubAuth(true, {
        uid: userInfo.uid,
        displayName: userInfo.displayName,
        email: userInfo.email,
        photoURL: userInfo.photoURL
      });

      // Update user profile with GitHub info
      const newDisplayName = userInfo.displayName || 'Ghost Hunter';
      const newPhotoUrl = userInfo.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=github';
      setUser(userInfo.uid, newDisplayName, newPhotoUrl);

      // Update squad status with new profile
      await updateSquadStatus(newDisplayName, newPhotoUrl);

      toast({
        title: "Welcome, Ghost Hunter!",
        description: `Successfully signed in as ${userInfo.displayName || userInfo.email || 'GitHub user'}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in with GitHub';
      toast({
        title: "Sign-in Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      clearGitHubAuth();
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast({
        title: "Sign-out Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isGitHubAuthenticated && gitHubUser) {
    return (
      <div className="space-y-4" data-testid="github-user-info">
        <div className="flex items-center gap-2 text-status-online font-jetbrains text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Connected with GitHub</span>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-primary/30">
          <Avatar className="w-16 h-16 border-2 border-accent">
            <AvatarImage src={gitHubUser.photoURL || undefined} alt="GitHub Avatar" />
            <AvatarFallback className="bg-primary/20 text-accent font-orbitron">
              <FaGithub className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow space-y-1">
            <div className="flex items-center gap-2 text-foreground font-orbitron">
              <User className="w-4 h-4 text-primary" />
              <span data-testid="github-display-name">{gitHubUser.displayName || 'GitHub User'}</span>
            </div>
            {gitHubUser.email && (
              <div className="flex items-center gap-2 text-muted-foreground font-jetbrains text-sm">
                <Mail className="w-4 h-4" />
                <span data-testid="github-email">{gitHubUser.email}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground font-jetbrains">
              UID: {gitHubUser.uid.slice(0, 12)}...
            </div>
          </div>
        </div>

        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          variant="outline"
          className="w-full font-orbitron uppercase tracking-wider border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          data-testid="button-sign-out"
        >
          {isLoading ? (
            <span className="animate-pulse">Signing out...</span>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="github-login">
      <div className="text-sm text-muted-foreground font-jetbrains">
        Sign in with GitHub to sync your profile across devices and sessions.
      </div>
      
      <Button
        onClick={handleGitHubSignIn}
        disabled={isLoading || !isFirebaseOnline}
        className="w-full font-orbitron uppercase tracking-wider bg-[#24292e] hover:bg-[#2f363d] text-white border border-[#444d56]"
        data-testid="button-github-sign-in"
      >
        {isLoading ? (
          <span className="animate-pulse">Connecting to GitHub...</span>
        ) : (
          <>
            <FaGithub className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </>
        )}
      </Button>
      
      {!isFirebaseOnline && (
        <div className="text-xs text-status-offline font-jetbrains text-center">
          ⚠️ Firebase is offline. GitHub sign-in unavailable.
        </div>
      )}
    </div>
  );
}
