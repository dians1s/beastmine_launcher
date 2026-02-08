import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Crown,
  Sparkles, ChevronLeft, ChevronRight, ArrowRight,
  Play, Pause, Gamepad2, ShoppingCart
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';
import { api } from '../utils/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from './Profile';
import Builds from './Builds';
import SettingsPage from './Settings';

// Данные новостей
const newsItems = [
  {
    id: 1,
    title: 'Обновление лаунчера v1.0',
    excerpt: 'Полностью переписан на Rust с максимальной производительностью',
    date: '2024-02-07',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
  },
  {
    id: 2,
    title: 'Новый сервер открыт!',
    excerpt: 'Присоединяйтесь к нашему новому серверу с уникальными модами',
    date: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
  },
  {
    id: 3,
    title: 'Скидки на привилегии',
    excerpt: 'Только сегодня скидка 50% на все VIP статусы',
    date: '2024-02-01',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200',
  },
  {
    id: 4,
    title: 'Новый модпак Hi-Tech',
    excerpt: 'Технологичное выживание с 200+ модами',
    date: '2024-01-28',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1200',
  },
];

const Launcher = () => {
  const { user, setUser, isGameRunning, setGameRunning } = useLauncherStore();
  const [activeTab, setActiveTab] = useState('home');
  const [isLaunching, setIsLaunching] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [onlinePlayers] = useState(142);

  // Автоматическое перелистывание новостей
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      setGameRunning(false);
    } else {
      setIsLaunching(true);
      try {
        console.log('Launching game...');
        setGameRunning(true);
      } catch (error) {
        console.error('Launch error:', error);
      } finally {
        setIsLaunching(false);
      }
    }
  };

  const nextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const goToNews = (index: number) => {
    setCurrentNewsIndex(index);
  };

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                {/* Верхняя часть - Слайдер новостей с rounded corners */}
                <div className="h-[60%] p-4 pb-2">
                  <div className="h-full relative overflow-hidden rounded-2xl shadow-2xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentNewsIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ 
                            backgroundImage: `url(${newsItems[currentNewsIndex].image})`,
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
                        
                        {/* News Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-1.5">
                                <Sparkles size={12} />
                                Новости
                              </span>
                              <span className="text-white/40 text-sm">{newsItems[currentNewsIndex].date}</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-3 max-w-2xl leading-tight">
                              {newsItems[currentNewsIndex].title}
                            </h2>
                            <p className="text-lg text-white/60 max-w-xl">
                              {newsItems[currentNewsIndex].excerpt}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                      onClick={prevNews}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all z-10 group"
                    >
                      <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={nextNews}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all z-10 group"
                    >
                      <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {newsItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToNews(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentNewsIndex 
                              ? 'w-8 bg-primary' 
                              : 'w-1.5 bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Нижняя часть - Две красивые карточки */}
                <div className="h-[40%] p-4 pt-2 grid grid-cols-2 gap-4">
                  {/* Левая карточка - Специальное предложение */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-primary/5 to-background border border-white/5 group"
                  >
                    {/* Фоновый градиент */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                    
                    {/* Декоративный blur */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all duration-500" />
                    
                    <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                      <div>
                        {/* Заголовок карточки */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                              <Crown size={20} className="text-amber-400" />
                            </div>
                            <div>
                              <span className="text-xs text-amber-400/80 font-medium uppercase tracking-wider">Спецпредложение</span>
                              <h3 className="text-lg font-bold text-white">Привилегия VIP</h3>
                            </div>
                          </div>
                          {/* Большой красивый badge -20% */}
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-black text-green-400 drop-shadow-lg">
                              -20%
                            </span>
                            <span className="text-[10px] text-green-400/70 uppercase tracking-wider font-bold">Скидка</span>
                          </div>
                        </div>

                        {/* Цена */}
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">1500</span>
                            <span className="text-sm text-white/50">BC</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/40 line-through">1875 BC</span>
                          </div>
                        </div>
                      </div>

                      {/* Кнопка */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="self-start px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 group/btn"
                      >
                        <ShoppingCart size={16} />
                        Перейти
                        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Правая карточка - Последняя сборка */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-white/5 group"
                  >
                    {/* Фоновый градиент */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    
                    {/* Декоративный blur */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
                    
                    <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                      <div>
                        {/* Заголовок карточки */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Gamepad2 size={20} className="text-primary" />
                          </div>
                          <div>
                            <span className="text-xs text-primary/80 font-medium uppercase tracking-wider">Последняя сборка</span>
                            <h3 className="text-lg font-bold text-white">Hi-Tech</h3>
                          </div>
                        </div>

                        {/* Инфо */}
                        <div>
                          <p className="text-xs text-white/50 mb-1">Версия 1.16.5</p>
                          <p className="text-sm text-white/70 line-clamp-1">
                            Технологичное выживание с 200+ модами
                          </p>
                        </div>
                      </div>

                      {/* Кнопка и онлайн */}
                      <div className="flex items-center justify-between">
                        <motion.button
                          onClick={handleLaunch}
                          disabled={isLaunching}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            px-8 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg
                            ${isGameRunning 
                              ? 'bg-red-500/90 hover:bg-red-500 shadow-red-500/25' 
                              : 'bg-gradient-to-r from-primary to-accent shadow-primary/25 hover:shadow-primary/40'
                            }
                          `}
                        >
                          {isLaunching ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Запуск...
                            </>
                          ) : isGameRunning ? (
                            <>
                              <Pause size={16} />
                              Остановить
                            </>
                          ) : (
                            <>
                              <Play size={16} fill="currentColor" />
                              Играть
                            </>
                          )}
                        </motion.button>

                        {/* Онлайн индикатор */}
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          <Users size={14} className="text-white/50" />
                          <span className="text-sm font-semibold text-white">{onlinePlayers}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'builds' && (
              <motion.div
                key="builds"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <Builds />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <Profile />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <SettingsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Launcher;