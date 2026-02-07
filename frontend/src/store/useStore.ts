import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../utils/api';

export interface User {
  uuid: string;
  username: string;
  email: string;
  skin_url?: string;
  cape_url?: string;
  privileges: string[];
  donate?: number;
  coins?: number;
  role?: number;
  id?: number;
  create_date?: string | null;
  last_date?: string | null;
}

export interface GameVersion {
  id: string;
  name: string;
  release_date: string;
  version_type: 'Release' | 'Snapshot' | 'OldAlpha' | 'OldBeta' | 'Modded';
  installed: boolean;
  size_mb: number;
}

export interface SystemInfo {
  os: string;
  cpu: string;
  cpu_cores: number;
  total_ram_gb: number;
  available_ram_gb: number;
  gpu: string;
}

interface LauncherState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedVersion: string | null;
  isGameRunning: boolean;
  systemInfo: SystemInfo | null;
  sidebarCollapsed: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setSelectedVersion: (version: string | null) => void;
  setGameRunning: (value: boolean) => void;
  setSystemInfo: (info: SystemInfo | null) => void;
  toggleSidebar: () => void;
  logout: () => void;
}

export const useLauncherStore = create<LauncherState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      selectedVersion: null,
      isGameRunning: false,
      systemInfo: null,
      sidebarCollapsed: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setSelectedVersion: (version) => set({ selectedVersion: version }),
      setGameRunning: (value) => set({ isGameRunning: value }),
      setSystemInfo: (info) => set({ systemInfo: info }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      logout: () => {
        api.clearTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'beastmine-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
