import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, Settings, User,
  Play, Pause,
  Sparkles, Package
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';
import { api } from '../utils/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GameCard from '../components/GameCard';
import NewsSection from '../components/NewsSection';
import SystemStats from '../components/SystemStats';
import Profile from './Profile';

const Launcher = () => {
  const { user, setUser, logout, selectedVersion, isGameRunning, setGameRunning } = useLauncherStore();
  const [activeTab, setActiveTab] = useState('play');
  const [isLaunching, setIsLaunching] = useState(false);

  // Загрузка данных профиля при старте
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        const result = await api.getPlayerInfo();
        if (result.data) {
          setUser({
            ...user,
            donate: result.data.donate,
            coins: result.data.coins,
            email: result.data.email,
            role: result.data.role,
          });
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      }
    };

    loadProfileData();
  }, []);

  const handleLaunch = async () => {
    if (isGameRunning) {
      // Остановка игры
      setGameRunning(false);
    } else {
      // Запуск игры
      setIsLaunching(true);
      try {
        // TODO: Implement game launch via Rust backend
        console.log('Launching game...');
        setGameRunning(true);
      } catch (error) {
        console.error('Launch error:', error);
      } finally {
        setIsLaunching(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
    }
  };

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onLogout={handleLogout} />
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'play' && (
              <motion.div
                key="play"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden">
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background-card to-accent/20" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=1200')] bg-cover bg-center opacity-20" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-sm text-primary font-medium">Готов к игре</span>
                      </div>
                      <h1 className="text-4xl font-bold text-white mb-2">
                        Добро пожаловать, {user?.username}!
                      </h1>
                      <p className="text-white/60 max-w-lg">
                        Выберите версию Minecraft и начните своё приключение прямо сейчас
                      </p>
                    </motion.div>

                    {/* Launch Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-8"
                    >
                      <motion.button
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative group px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3
                          transition-all duration-300 overflow-hidden
                          ${isGameRunning 
                            ? 'bg-error hover:bg-error/90' 
                            : 'bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25'
                          }
                        `}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        {isLaunching ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Запуск...
                          </>
                        ) : isGameRunning ? (
                          <>
                            <Pause size={20} />
                            Остановить
                          </>
                        ) : (
                          <>
                            <Play size={20} fill="currentColor" />
                            Играть
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                </div>

                {/* Game Versions Grid */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Gamepad2 size={20} className="text-primary" />
                    Версии Minecraft
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <GameCard 
                      name="Minecraft 1.20.4" 
                      type="release" 
                      isSelected={selectedVersion === '1.20.4'}
                      onClick={() => useLauncherStore.setState({ selectedVersion: '1.20.4' })}
                    />
                    <GameCard 
                      name="Minecraft 1.19.4" 
                      type="release" 
                      isSelected={selectedVersion === '1.19.4'}
                      onClick={() => useLauncherStore.setState({ selectedVersion: '1.19.4' })}
                    />
                    <GameCard 
                      name="Forge 1.20.1" 
                      type="modded" 
                      isSelected={selectedVersion === 'forge-1.20.1'}
                      onClick={() => useLauncherStore.setState({ selectedVersion: 'forge-1.20.1' })}
                    />
                  </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <NewsSection />
                  <SystemStats />
                </div>
              </motion.div>
            )}

            {activeTab === 'modpacks' && (
              <motion.div
                key="modpacks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Package size={64} className="mx-auto text-white/20 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Модпаки</h2>
                <p className="text-white/60">Раздел в разработке</p>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <Profile />
              </motion.div>
            )}

            {activeTab === 'skins' && (
              <motion.div
                key="skins"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <User size={64} className="mx-auto text-white/20 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Скины</h2>
                <p className="text-white/60">Раздел в разработке</p>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Settings size={64} className="mx-auto text-white/20 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Настройки</h2>
                <p className="text-white/60">Раздел в разработке</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Launcher;
