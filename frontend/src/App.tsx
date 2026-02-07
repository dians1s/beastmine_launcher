import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLauncherStore, SystemInfo } from './store/useStore';
import { invoke } from '@tauri-apps/api/core';
import { api } from './utils/api';

// Pages
import Login from './pages/Login';
import Launcher from './pages/Launcher';
import Loading from './components/Loading';
import TitleBar from './components/TitleBar';

// Background effect
const Background = () => (
  <div className="fixed inset-0 -z-10">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
    
    {/* Animated orbs */}
    <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
    
    {/* Grid pattern */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }}
    />
    
    {/* Noise texture */}
    <div className="absolute inset-0 noise opacity-50" />
  </div>
);

function App() {
  const { isAuthenticated, isLoading, setLoading, setSystemInfo } = useLauncherStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Получаем системную информацию
        const sysInfo = await invoke<SystemInfo>('get_system_info');
        setSystemInfo(sysInfo);
        
        // Проверяем сессию
        const session = await invoke<{ user: any } | null>('check_session');
        if (session?.user) {
          // Verify tokens are available for API calls
          if (!api.hasTokens()) {
            console.warn('Session restored but API tokens missing - logging out');
            useLauncherStore.getState().logout();
          } else {
            useLauncherStore.getState().setUser(session.user);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initialize();
  }, [setLoading, setSystemInfo]);

  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <Background />
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Background />
      <TitleBar />
      
      <div className="flex-1 overflow-hidden">
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/launcher" replace /> : 
                    <Login />
                } 
              />
              <Route 
                path="/launcher/*" 
                element={
                  isAuthenticated ? 
                    <Launcher /> : 
                    <Navigate to="/login" replace />
                } 
              />
              <Route path="/" element={<Navigate to="/launcher" replace />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
