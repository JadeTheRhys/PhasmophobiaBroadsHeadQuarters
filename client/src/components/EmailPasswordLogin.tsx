/**
 * EmailPasswordLogin Component
 * 
 * Provides Email/Password authentication using Firebase Client SDK methods:
 * - signInWithEmailAndPassword for existing users
 * - createUserWithEmailAndPassword for new registrations
 * - sendPasswordResetEmail for password recovery
 * 
 * This component uses ONLY client-side safe Firebase operations and
 * does not use any Firebase Admin SDK methods.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword,
  signOut, 
  updateSquadStatus 
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogOut, UserPlus, LogIn, KeyRound, CheckCircle2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Default fallback values for user profile
const DEFAULT_DISPLAY_NAME = 'Ghost Hunter';
const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/bottts/svg?seed=email';

export function EmailPasswordLogin() {
  const { 
    isFirebaseOnline,
    setGitHubAuth, 
    clearGitHubAuth,
    setUser,
    gitHubUser,
    isGitHubAuthenticated
  } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);
  const [emailUser, setEmailUser] = useState<{ uid: string; email: string | null } | null>(null);
  const { toast } = useToast();

  /**
   * Helper function to update auth state after successful authentication.
   * Uses the unified auth state (setGitHubAuth) for all providers to simplify
   * state management and ensure consistent UI behavior.
   */
  const updateAuthState = async (uid: string, displayName: string, userEmail: string | null) => {
    // Update local component state
    setEmailUser({ uid, email: userEmail });
    setIsEmailAuthenticated(true);
    
    // Update unified auth state (used for both GitHub and Email auth)
    setGitHubAuth(true, {
      uid,
      displayName,
      email: userEmail,
      photoURL: DEFAULT_AVATAR_URL
    });

    // Update user profile
    setUser(uid, displayName, DEFAULT_AVATAR_URL);

    // Update squad status with new profile
    await updateSquadStatus(displayName, DEFAULT_AVATAR_URL);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    if (!isFirebaseOnline) {
      toast({
        title: "Offline Mode",
        description: "Firebase is offline. Email sign-in requires an online connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const userInfo = await signInWithEmail(email, password);
      const displayName = userInfo.displayName || email.split('@')[0] || DEFAULT_DISPLAY_NAME;
      
      // Update auth state (using unified auth state management)
      // Note: setGitHubAuth is reused here to maintain a single auth state for all providers
      // This simplifies state management across GitHub and Email authentication
      await updateAuthState(userInfo.uid, displayName, userInfo.email);

      toast({
        title: "Welcome Back, Ghost Hunter!",
        description: `Successfully signed in as ${userInfo.email}.`,
      });
      
      // Clear form
      setEmail('');
      setPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      toast({
        title: "Sign-in Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    if (!isFirebaseOnline) {
      toast({
        title: "Offline Mode",
        description: "Firebase is offline. Account creation requires an online connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const userInfo = await signUpWithEmail(email, password);
      const displayName = email.split('@')[0] || DEFAULT_DISPLAY_NAME;
      
      // Update auth state (using unified auth state management)
      await updateAuthState(userInfo.uid, displayName, userInfo.email);

      toast({
        title: "Account Created!",
        description: `Welcome, ${email}! Your ghost hunter account is ready.`,
      });
      
      // Clear form
      setEmail('');
      setPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    if (!isFirebaseOnline) {
      toast({
        title: "Offline Mode",
        description: "Firebase is offline. Password reset requires an online connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      toast({
        title: "Reset Email Sent",
        description: `Password reset instructions sent to ${email}.`,
      });
      setMode('signin');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast({
        title: "Reset Failed",
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
      setIsEmailAuthenticated(false);
      setEmailUser(null);
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

  // Show authenticated state if user is signed in with email or GitHub
  if ((isEmailAuthenticated && emailUser) || (isGitHubAuthenticated && gitHubUser)) {
    const displayEmail = emailUser?.email || gitHubUser?.email;
    const displayUid = emailUser?.uid || gitHubUser?.uid;
    
    return (
      <div className="space-y-4" data-testid="email-user-info">
        <div className="flex items-center gap-2 text-status-online font-jetbrains text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Connected with {isGitHubAuthenticated ? 'GitHub' : 'Email'}</span>
        </div>
        
        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-primary/30">
          <Avatar className="w-16 h-16 border-2 border-accent">
            <AvatarImage src={gitHubUser?.photoURL || DEFAULT_AVATAR_URL} alt="Avatar" />
            <AvatarFallback className="bg-primary/20 text-accent font-orbitron">
              <Mail className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow space-y-1">
            <div className="flex items-center gap-2 text-foreground font-orbitron">
              <User className="w-4 h-4 text-primary" />
              <span data-testid="email-display-name">
                {gitHubUser?.displayName || displayEmail?.split('@')[0] || 'Ghost Hunter'}
              </span>
            </div>
            {displayEmail && (
              <div className="flex items-center gap-2 text-muted-foreground font-jetbrains text-sm">
                <Mail className="w-4 h-4" />
                <span data-testid="email-address">{displayEmail}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground font-jetbrains">
              UID: {displayUid?.slice(0, 12)}...
            </div>
          </div>
        </div>

        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          variant="outline"
          className="w-full font-orbitron uppercase tracking-wider border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          data-testid="button-sign-out-email"
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
    <div className="space-y-4" data-testid="email-login">
      <div className="text-sm text-muted-foreground font-jetbrains">
        {mode === 'signin' && 'Sign in with your email and password.'}
        {mode === 'signup' && 'Create a new ghost hunter account.'}
        {mode === 'reset' && 'Enter your email to receive reset instructions.'}
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-jetbrains text-primary">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ghost.hunter@email.com"
              className="pl-10 bg-background/50 border-primary focus:border-accent text-foreground font-jetbrains"
              disabled={isLoading || !isFirebaseOnline}
              data-testid="input-email"
            />
          </div>
        </div>
        
        {mode !== 'reset' && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-jetbrains text-primary">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-background/50 border-primary focus:border-accent text-foreground font-jetbrains"
                disabled={isLoading || !isFirebaseOnline}
                data-testid="input-password"
              />
            </div>
          </div>
        )}
      </div>

      {mode === 'signin' && (
        <>
          <Button
            onClick={handleSignIn}
            disabled={isLoading || !isFirebaseOnline}
            className="w-full font-orbitron uppercase tracking-wider"
            data-testid="button-email-sign-in"
          >
            {isLoading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
          
          <div className="flex justify-between text-xs font-jetbrains">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-primary hover:text-accent transition-colors"
              disabled={isLoading}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode('reset')}
              className="text-muted-foreground hover:text-primary transition-colors"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>
        </>
      )}

      {mode === 'signup' && (
        <>
          <Button
            onClick={handleSignUp}
            disabled={isLoading || !isFirebaseOnline}
            className="w-full font-orbitron uppercase tracking-wider bg-accent hover:bg-accent/80"
            data-testid="button-email-sign-up"
          >
            {isLoading ? (
              <span className="animate-pulse">Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
          
          <button
            type="button"
            onClick={() => setMode('signin')}
            className="w-full text-center text-xs font-jetbrains text-muted-foreground hover:text-primary transition-colors"
            disabled={isLoading}
          >
            Already have an account? Sign In
          </button>
        </>
      )}

      {mode === 'reset' && (
        <>
          <Button
            onClick={handleResetPassword}
            disabled={isLoading || !isFirebaseOnline}
            className="w-full font-orbitron uppercase tracking-wider"
            data-testid="button-reset-password"
          >
            {isLoading ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4 mr-2" />
                Send Reset Email
              </>
            )}
          </Button>
          
          <button
            type="button"
            onClick={() => setMode('signin')}
            className="w-full text-center text-xs font-jetbrains text-muted-foreground hover:text-primary transition-colors"
            disabled={isLoading}
          >
            Back to Sign In
          </button>
        </>
      )}
      
      {!isFirebaseOnline && (
        <div className="text-xs text-status-offline font-jetbrains text-center">
          ⚠️ Firebase is offline. Authentication unavailable.
        </div>
      )}
    </div>
  );
}
