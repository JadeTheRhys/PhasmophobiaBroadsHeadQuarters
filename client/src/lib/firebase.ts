/**
 * Firebase Client SDK Configuration and Authentication
 * 
 * This module uses ONLY Firebase Client SDK methods for authentication.
 * All auth operations are client-side safe and do not require admin privileges.
 * 
 * Supported authentication methods:
 * - Anonymous sign-in (signInAnonymously)
 * - GitHub OAuth (signInWithPopup with GithubAuthProvider)
 * - Email/Password (signInWithEmailAndPassword, createUserWithEmailAndPassword)
 * 
 * IMPORTANT: This file does NOT use any Firebase Admin SDK methods.
 * All operations are performed using the standard Firebase Web SDK which
 * only allows users to modify their own authentication data.
 */

import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GithubAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged, 
  User, 
  Auth,
  UserCredential
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
  Firestore
} from "firebase/firestore";

/**
 * Firebase configuration
 * Uses environment variables with fallback to default values for development.
 * 
 * Note: These are client-side configuration values that are safe to expose.
 * The Firebase security rules control data access, not these config values.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDKAUcB3EbLuVU-ksSa14vIR8Ct5zui1gQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "phasmophobia-hq.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "phasmophobia-hq",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "phasmophobia-hq.firebasestorage.app",
  messagingSenderId: "477100343828",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:477100343828:web:9cc338e6a081bbab631d01"
};

const isFirebaseConfigured = true;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (firebaseConfig) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };

let currentUserId: string | null = null;

export function getCurrentUserId(): string | null {
  return currentUserId;
}

export function isFirebaseConnected(): boolean {
  return isFirebaseConfigured && db !== null && auth !== null;
}

/**
 * Initialize Firebase Authentication
 * Uses Firebase Client SDK onAuthStateChanged and signInAnonymously methods
 * 
 * This function:
 * 1. Checks if a user is already authenticated
 * 2. If not, creates an anonymous session for basic app functionality
 * 3. Returns the user ID and online status
 * 
 * Note: Anonymous sign-in is a client-safe operation that does not require
 * admin privileges and only creates a session for the current user.
 */
export async function initializeFirebaseAuth(): Promise<{ userId: string; isOnline: boolean }> {
  // If Firebase is not configured, generate a local offline user ID
  if (!auth || !isFirebaseConfigured) {
    // Use crypto.randomUUID for better uniqueness, fallback to timestamp-based ID
    const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    currentUserId = `offline-${randomPart}`;
    console.log("Firebase not configured. Using offline mode — ID:", currentUserId);
    return { userId: currentUserId, isOnline: false };
  }

  const authInstance = auth;
  return new Promise((resolve, reject) => {
    onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        currentUserId = user.uid;
        console.log("Firebase Auth Ready — UID:", currentUserId);
        resolve({ userId: currentUserId, isOnline: true });
      } else {
        try {
          const result = await signInAnonymously(authInstance);
          currentUserId = result.user.uid;
          console.log("Signed in anonymously — UID:", currentUserId);
          resolve({ userId: currentUserId, isOnline: true });
        } catch (error) {
          console.error("Firebase auth error:", error);
          reject(error);
        }
      }
    });
  });
}

/**
 * GitHub user info interface
 * Used after successful GitHub OAuth sign-in
 */
export interface GitHubUserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
}

/**
 * Sign in with GitHub using OAuth popup
 * Uses Firebase Client SDK signInWithPopup method with GithubAuthProvider
 * 
 * This is a safe, client-side OAuth flow that:
 * 1. Opens a popup window for GitHub OAuth
 * 2. User authorizes the app on GitHub
 * 3. Firebase receives the OAuth token and creates/updates the user
 * 
 * Note: This only authenticates the current user and does not modify other accounts.
 */
export async function signInWithGitHub(): Promise<GitHubUserInfo> {
  if (!auth) {
    throw new Error("Firebase is not configured. GitHub sign-in is unavailable.");
  }

  const provider = new GithubAuthProvider();
  // Request additional scopes if needed
  provider.addScope('read:user');
  provider.addScope('user:email');

  try {
    const result: UserCredential = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Update module-level userId for Firebase operations (sendChatMessage, updateSquadStatus, etc.)
    currentUserId = user.uid;
    console.log("Signed in with GitHub — UID:", currentUserId);

    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      providerId: 'github.com'
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    console.error("GitHub sign-in error:", firebaseError);
    
    // Provide user-friendly error messages
    if (firebaseError.code === 'auth/popup-closed-by-user') {
      throw new Error("Sign-in was cancelled. Please try again.");
    } else if (firebaseError.code === 'auth/account-exists-with-different-credential') {
      throw new Error("An account already exists with the same email. Try signing in with a different method.");
    } else if (firebaseError.code === 'auth/popup-blocked') {
      throw new Error("Popup was blocked by browser. Please allow popups for this site.");
    } else {
      throw new Error(firebaseError.message || "Failed to sign in with GitHub. Please try again.");
    }
  }
}

/**
 * Sign out the current user from Firebase
 * Uses Firebase Client SDK signOut method
 * 
 * This only signs out the currently authenticated user and does not
 * affect any other users or sessions.
 */
export async function signOut(): Promise<void> {
  if (!auth) {
    console.warn("Firebase is not configured. Sign out skipped.");
    return;
  }

  try {
    await firebaseSignOut(auth);
    currentUserId = null;
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign out error:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
}

/**
 * Get the currently authenticated Firebase user
 * Returns null if no user is signed in
 */
export function getCurrentUser(): User | null {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
}

/**
 * Check if the current user is authenticated with GitHub OAuth
 */
export function isGitHubAuthenticated(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.providerData.some(provider => provider.providerId === 'github.com');
}

/**
 * Check if the current user is authenticated with Email/Password
 */
export function isEmailPasswordAuthenticated(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.providerData.some(provider => provider.providerId === 'password');
}

/**
 * Email/Password user info interface
 * Used for both sign-in and registration flows
 */
export interface EmailPasswordUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  providerId: string;
}

/**
 * Sign in with Email and Password
 * Uses Firebase Client SDK signInWithEmailAndPassword method
 * This is a safe, client-side operation that only authenticates the current user
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with user information
 */
export async function signInWithEmail(email: string, password: string): Promise<EmailPasswordUserInfo> {
  if (!auth) {
    throw new Error("Firebase is not configured. Email sign-in is unavailable.");
  }

  try {
    // signInWithEmailAndPassword is a Firebase Client SDK method
    // It only allows users to sign in with their own credentials
    const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update module-level userId for Firebase operations
    currentUserId = user.uid;
    console.log("Signed in with Email — UID:", currentUserId);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerId: 'password'
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    console.error("Email sign-in error:", firebaseError);
    
    // Provide user-friendly error messages for common auth errors
    if (firebaseError.code === 'auth/user-not-found') {
      throw new Error("No account found with this email address.");
    } else if (firebaseError.code === 'auth/wrong-password') {
      throw new Error("Incorrect password. Please try again.");
    } else if (firebaseError.code === 'auth/invalid-email') {
      throw new Error("Invalid email address format.");
    } else if (firebaseError.code === 'auth/user-disabled') {
      throw new Error("This account has been disabled.");
    } else if (firebaseError.code === 'auth/too-many-requests') {
      throw new Error("Too many failed attempts. Please try again later.");
    } else if (firebaseError.code === 'auth/invalid-credential') {
      throw new Error("Invalid email or password. Please check your credentials.");
    } else {
      throw new Error(firebaseError.message || "Failed to sign in. Please try again.");
    }
  }
}

/**
 * Create a new user account with Email and Password
 * Uses Firebase Client SDK createUserWithEmailAndPassword method
 * This is a safe, client-side operation that creates a new user account
 * 
 * @param email - User's email address
 * @param password - User's password (minimum 6 characters)
 * @returns Promise with user information
 */
export async function signUpWithEmail(email: string, password: string): Promise<EmailPasswordUserInfo> {
  if (!auth) {
    throw new Error("Firebase is not configured. Email registration is unavailable.");
  }

  try {
    // createUserWithEmailAndPassword is a Firebase Client SDK method
    // It creates a new account for the user signing up
    const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update module-level userId for Firebase operations
    currentUserId = user.uid;
    console.log("Signed up with Email — UID:", currentUserId);

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerId: 'password'
    };
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    console.error("Email registration error:", firebaseError);
    
    // Provide user-friendly error messages for common registration errors
    if (firebaseError.code === 'auth/email-already-in-use') {
      throw new Error("An account with this email already exists.");
    } else if (firebaseError.code === 'auth/invalid-email') {
      throw new Error("Invalid email address format.");
    } else if (firebaseError.code === 'auth/weak-password') {
      throw new Error("Password is too weak. Use at least 6 characters.");
    } else if (firebaseError.code === 'auth/operation-not-allowed') {
      throw new Error("Email/Password sign-up is not enabled in Firebase.");
    } else {
      throw new Error(firebaseError.message || "Failed to create account. Please try again.");
    }
  }
}

/**
 * Send a password reset email
 * Uses Firebase Client SDK sendPasswordResetEmail method
 * This is a safe, client-side operation
 * 
 * @param email - User's email address
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error("Firebase is not configured. Password reset is unavailable.");
  }

  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to:", email);
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    console.error("Password reset error:", firebaseError);
    
    if (firebaseError.code === 'auth/user-not-found') {
      throw new Error("No account found with this email address.");
    } else if (firebaseError.code === 'auth/invalid-email') {
      throw new Error("Invalid email address format.");
    } else {
      throw new Error(firebaseError.message || "Failed to send reset email. Please try again.");
    }
  }
}

export interface FirebaseChatMessage {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string;
  text: string;
  isCommand: boolean;
  timestamp: Date;
}

export interface FirebaseGhostEvent {
  id: string;
  type: string;
  intensity: number;
  message: string;
  triggeredBy: string;
  timestamp: Date;
}

export interface FirebaseSquadStatus {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string;
  isDead: boolean;
  map: string;
  location: string;
  timestamp: Date;
}

export async function sendChatMessage(
  text: string, 
  displayName: string, 
  photoUrl: string, 
  isCommand: boolean = false
) {
  if (!currentUserId || !db) return;
  
  await addDoc(collection(db, "chat"), {
    userId: currentUserId,
    displayName,
    photoUrl,
    text,
    isCommand,
    timestamp: serverTimestamp()
  });
}

export async function triggerGhostEvent(type: string, intensity: number = 3) {
  if (!currentUserId || !db) return;
  
  const eventMessages: Record<string, string> = {
    hunt: "HUNT INITIATED! All agents take cover immediately!",
    flicker: "Lights flickering detected. Paranormal activity rising.",
    manifest: "Ghost manifestation in progress...",
    slam: "Door SLAM! Ghost activity confirmed.",
    curse: "Cursed object interaction detected!",
    event: "Paranormal event registered."
  };

  await addDoc(collection(db, "events"), {
    type,
    intensity,
    message: eventMessages[type] || eventMessages.event,
    triggeredBy: currentUserId,
    timestamp: serverTimestamp()
  });
}

export async function updateSquadStatus(
  displayName: string,
  photoUrl: string,
  isDead?: boolean,
  map?: string,
  location?: string
) {
  if (!currentUserId || !db) return;
  
  const statusRef = doc(db, "status", currentUserId);
  await setDoc(statusRef, {
    userId: currentUserId,
    displayName,
    photoUrl,
    isDead: isDead ?? false,
    map: map ?? null,
    location: location ?? null,
    timestamp: serverTimestamp()
  }, { merge: true });
}

export async function saveEvidence(evidence: string, displayName: string) {
  if (!currentUserId || !db) return;
  
  await addDoc(collection(db, "evidence"), {
    userId: currentUserId,
    evidence,
    displayName,
    timestamp: serverTimestamp()
  });
}

export function subscribeToChatMessages(
  callback: (messages: FirebaseChatMessage[]) => void
) {
  if (!db) {
    // Return no-op unsubscribe when Firebase is not configured
    return () => {};
  }

  const q = query(
    collection(db, "chat"), 
    orderBy("timestamp", "asc"),
    limit(100)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages: FirebaseChatMessage[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName || "Unknown",
        photoUrl: data.photoUrl || "",
        text: data.text,
        isCommand: data.isCommand || false,
        timestamp: data.timestamp?.toDate() || new Date()
      });
    });
    callback(messages);
  });
}

export function subscribeToGhostEvents(
  callback: (event: FirebaseGhostEvent) => void
) {
  if (!db) {
    // Return no-op unsubscribe when Firebase is not configured
    return () => {};
  }

  const q = query(
    collection(db, "events"), 
    orderBy("timestamp", "desc"),
    limit(1)
  );
  
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        callback({
          id: change.doc.id,
          type: data.type,
          intensity: data.intensity || 3,
          message: data.message || "",
          triggeredBy: data.triggeredBy || "",
          timestamp: data.timestamp?.toDate() || new Date()
        });
      }
    });
  });
}

export function subscribeToSquadStatus(
  callback: (statuses: FirebaseSquadStatus[]) => void
) {
  if (!db) {
    // Return no-op unsubscribe when Firebase is not configured
    return () => {};
  }

  return onSnapshot(collection(db, "status"), (snapshot) => {
    const statuses: FirebaseSquadStatus[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      statuses.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName || "Unknown",
        photoUrl: data.photoUrl || "",
        isDead: data.isDead || false,
        map: data.map || "Unknown",
        location: data.location || "Unknown",
        timestamp: data.timestamp?.toDate() || new Date()
      });
    });
    callback(statuses);
  });
}

export function subscribeToEvidence(
  callback: (evidence: { id: string; evidence: string; displayName: string }[]) => void
) {
  if (!db) {
    // Return no-op unsubscribe when Firebase is not configured
    return () => {};
  }

  const q = query(collection(db, "evidence"), orderBy("timestamp", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const evidenceList: { id: string; evidence: string; displayName: string }[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      evidenceList.push({
        id: doc.id,
        evidence: data.evidence,
        displayName: data.displayName || "Unknown"
      });
    });
    callback(evidenceList);
  });
}
