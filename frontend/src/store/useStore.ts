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

export interface BuildSettings {
  ram_mb: number;
  java_args: string;
  fullscreen: boolean;
}

export interface Build {
  id: string;
  name: string;
  version: string;
  description: string;
  image: string;
  mod_count: number;
  installed: boolean;
  settings: BuildSettings;
}

interface LauncherState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedVersion: string | null;
  isGameRunning: boolean;
  systemInfo: SystemInfo | null;
  sidebarCollapsed: boolean;
  builds: Build[];
  selectedBuild: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setSelectedVersion: (version: string | null) => void;
  setGameRunning: (value: boolean) => void;
  setSystemInfo: (info: SystemInfo | null) => void;
  toggleSidebar: () => void;
  logout: () => void;
  setBuilds: (builds: Build[]) => void;
  setSelectedBuild: (buildId: string | null) => void;
  updateBuildSettings: (buildId: string, settings: Partial<BuildSettings>) => void;
  installBuild: (buildId: string) => void;
  uninstallBuild: (buildId: string) => void;
}

// Начальные данные сборок
const defaultBuilds: Build[] = [
  {
    id: 'hi-tech',
    name: 'Hi-Tech',
    version: '1.16.5',
    description: 'Технологичное выживание с более чем 200 модами. Автоматизация, магия и приключения ждут вас!',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800',
    mod_count: 215,
    installed: true,
    settings: {
      ram_mb: 4096,
      java_args: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled',
      fullscreen: false,
    },
  },
  {
    id: 'magic-rpg',
    name: 'Magic RPG',
    version: '1.12.2',
    description: 'Магическая сборка с системой прокачки, заклинаниями и мистическими существами.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    mod_count: 180,
    installed: false,
    settings: {
      ram_mb: 3072,
      java_args: '-XX:+UseG1GC',
      fullscreen: false,
    },
  },
  {
    id: 'vanilla-plus',
    name: 'Vanilla+',
    version: '1.20.1',
    description: 'Лёгкая сборка с QoL модами. Сохраняет ванильное ощущение с небольшими улучшениями.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800',
    mod_count: 45,
    installed: false,
    settings: {
      ram_mb: 2048,
      java_args: '',
      fullscreen: false,
    },
  },
];

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
      builds: defaultBuilds,
      selectedBuild: 'hi-tech',

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
      setBuilds: (builds) => set({ builds }),
      setSelectedBuild: (buildId) => set({ selectedBuild: buildId }),
      updateBuildSettings: (buildId, settings) => set((state) => ({
        builds: state.builds.map((build) =>
          build.id === buildId ? { ...build, settings: { ...build.settings, ...settings } } : build
        ),
      })),
      installBuild: (buildId) => set((state) => ({
        builds: state.builds.map((build) =>
          build.id === buildId ? { ...build, installed: true } : build
        ),
      })),
      uninstallBuild: (buildId) => set((state) => ({
        builds: state.builds.map((build) =>
          build.id === buildId ? { ...build, installed: false } : build
        ),
      })),
    }),
    {
      name: 'beastmine-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
        builds: state.builds,
        selectedBuild: state.selectedBuild,
      }),
    }
  )
);
