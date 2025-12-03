import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithPopup, 
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

// Firebase configuration - uses environment variables or falls back to hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2WA7yotRlqNidwIgJcT19JNrK8ukMgs4",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "phasmophobiabroads"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "phasmophobiabroads",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "phasmophobiabroads"}.firebasestorage.app`,
  messagingSenderId: "503659624108",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:503659624108:web:6e57fbc6bf36b0d5989109"
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

// GitHub user info interface
export interface GitHubUserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
}

// Sign in with GitHub using popup
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

// Sign out from Firebase
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

// Get current authenticated user
export function getCurrentUser(): User | null {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
}

// Check if user is authenticated with GitHub
export function isGitHubAuthenticated(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.providerData.some(provider => provider.providerId === 'github.com');
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
