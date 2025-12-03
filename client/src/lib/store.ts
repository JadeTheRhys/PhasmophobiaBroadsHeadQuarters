import { create } from 'zustand';

interface AppState {
  userId: string;
  displayName: string;
  photoUrl: string;
  isFlickering: boolean;
  isShaking: boolean;
  emfLevel: number;
  isFirebaseOnline: boolean;
  activeTab: 'chat' | 'evidence' | 'ghost' | 'cases' | 'squad' | 'profile';
  setUser: (userId: string, displayName: string, photoUrl: string) => void;
  setFlickering: (value: boolean) => void;
  setShaking: (value: boolean) => void;
  setEmfLevel: (level: number) => void;
  setFirebaseOnline: (value: boolean) => void;
  setActiveTab: (tab: 'chat' | 'evidence' | 'ghost' | 'cases' | 'squad' | 'profile') => void;
  triggerEffect: (type: 'hunt' | 'flicker' | 'slam' | 'manifest') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userId: '',
  displayName: 'Ghost Hunter',
  photoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=default',
  isFlickering: false,
  isShaking: false,
  emfLevel: 0,
  isFirebaseOnline: false,
  activeTab: 'chat',
  
  setUser: (userId, displayName, photoUrl) => set({ userId, displayName, photoUrl }),
  setFlickering: (value) => set({ isFlickering: value }),
  setShaking: (value) => set({ isShaking: value }),
  setEmfLevel: (level) => set({ emfLevel: Math.min(5, Math.max(0, level)) }),
  setFirebaseOnline: (value) => set({ isFirebaseOnline: value }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  triggerEffect: (type) => {
    if (type === 'hunt' || type === 'slam') {
      set({ isShaking: true, emfLevel: 5 });
      setTimeout(() => set({ isShaking: false }), 500);
    } else if (type === 'flicker' || type === 'manifest') {
      set({ isFlickering: true, emfLevel: Math.floor(Math.random() * 3) + 2 });
      setTimeout(() => set({ isFlickering: false }), 1000);
    }
    setTimeout(() => set({ emfLevel: 0 }), 3000);
  }
}));

export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15);
}

export function formatTime(timestamp: Date | string | number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
