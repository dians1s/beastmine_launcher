import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, LogOut, Settings,
  User as UserIcon
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const { user, isGameRunning } = useLauncherStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 relative" style={{ zIndex: 50 }}>
        {/* Left - Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Поиск..."
              className="h-9 w-64 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all no-drag"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Game Status */}
          {isGameRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Игра запущена</span>
            </motion.div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all relative no-drag"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors no-drag"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-white hidden sm:block">{user?.username}</span>
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
              top: '72px', 
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

      {/* Profile Dropdown - Fixed position */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed glass-strong rounded-xl p-2 shadow-2xl"
            style={{ 
              top: '72px', 
              right: '24px', 
              width: '224px', 
              zIndex: 99999 
            }}
          >
            <div className="px-3 py-2 border-b border-white/5 mb-2">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-white/40">{user?.email}</p>
            </div>
            
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm text-left no-drag"
            >
              <UserIcon size={16} />
              Профиль
            </button>
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm text-left no-drag"
            >
              <Settings size={16} />
              Настройки
            </button>
            <div className="border-t border-white/5 my-2" />
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-error hover:bg-error/10 transition-colors text-sm text-left no-drag"
            >
              <LogOut size={16} />
              Выйти
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
