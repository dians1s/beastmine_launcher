import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Minus, X
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';
import { getCurrentWindow } from '@tauri-apps/api/window';

const Header = () => {
  const { isGameRunning } = useLauncherStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [appWindow, setAppWindow] = useState<any>(null);

  // Инициализация окна
  useState(() => {
    const initWindow = async () => {
      try {
        const currentWindow = await getCurrentWindow();
        setAppWindow(currentWindow);
      } catch (error) {
        console.error('Failed to get current window:', error);
      }
    };
    initWindow();
  });

  const handleMinimize = async () => {
    if (appWindow) {
      try {
        await appWindow.minimize();
      } catch (error) {
        console.error('Minimize error:', error);
      }
    }
  };

  const handleClose = async () => {
    if (appWindow) {
      try {
        await appWindow.close();
      } catch (error) {
        console.error('Close error:', error);
      }
    }
  };

  return (
    <>
      <header 
        className="h-12 glass border-b border-white/5 flex items-center justify-center px-4 relative" 
        style={{ zIndex: 50 }}
        data-tauri-drag-region
      >
        {/* Center - Search */}
        <div className="flex items-center gap-4 no-drag absolute left-1/2 -translate-x-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input
              type="text"
              placeholder="Поиск..."
              className="h-8 w-64 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all no-drag"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 no-drag ml-auto">
          {/* Game Status */}
          {isGameRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 border border-success/30 mr-2"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Игра запущена</span>
            </motion.div>
          )}

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all relative"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* Window Controls */}
          <div className="flex items-center ml-2 border-l border-white/10 pl-2">
            <button
              onClick={handleMinimize}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
              title="Свернуть"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 transition-colors rounded-lg"
              title="Закрыть"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Dropdown - Fixed position */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed glass-strong rounded-xl p-4 shadow-2xl"
            style={{ 
              top: '56px', 
              right: '80px', 
              width: '320px', 
              zIndex: 99999 
            }}
          >
            <h3 className="text-sm font-semibold text-white mb-3">Уведомления</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-sm text-white">Новое обновление доступно</p>
                <p className="text-xs text-white/40 mt-1">5 минут назад</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-sm text-white">Доступен новый модпак</p>
                <p className="text-xs text-white/40 mt-1">1 час назад</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;