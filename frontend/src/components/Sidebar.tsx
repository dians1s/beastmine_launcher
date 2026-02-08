import { motion } from 'framer-motion';
import { 
  Home, Settings, Boxes
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { sidebarCollapsed, user } = useLauncherStore();

  const menuItems = [
    { id: 'home', icon: Home, label: 'Главная' },
    { id: 'builds', icon: Boxes, label: 'Сборки' },
    { id: 'settings', icon: Settings, label: 'Настройки' },
  ];

  // Ссылка на скин для головы персонажа
  const skinUrl = user?.username 
    ? `https://beastmine.ru/skins/${user.username}.png`
    : null;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: sidebarCollapsed ? 80 : 260 
      }}
      transition={{ duration: 0.3 }}
      className="h-full glass-strong flex flex-col relative z-20"
      data-tauri-drag-region
    >
      {/* Logo - drag area */}
      <div className="h-16 flex items-center px-4 border-b border-white/5" data-tauri-drag-region>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 pointer-events-none"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img 
              src="/logo.svg" 
              alt="BeastMine" 
              className="w-full h-full object-contain"
            />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-white whitespace-nowrap text-lg">BeastMine</span>
          )}
        </motion.div>
      </div>

      {/* Menu - no drag on buttons */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTabChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 no-drag
                ${isActive 
                  ? 'bg-primary/20 text-primary border border-primary/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} />
              {!sidebarCollapsed && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User - no drag */}
      <div className="p-3 border-t border-white/5 no-drag">
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => onTabChange('profile')}
          className={`
            flex items-center gap-3 p-2 rounded-xl bg-white/5 cursor-pointer no-drag
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          {skinUrl ? (
            <div 
              className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
              style={{
                backgroundImage: `url(${skinUrl})`,
                backgroundSize: '320px',
                backgroundPosition: '-40px -40px',
                imageRendering: 'pixelated',
                backgroundRepeat: 'no-repeat',
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username}</p>
              {/* Валюты */}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <img 
                    src="/beastcoin.svg" 
                    alt="BC" 
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span className="text-xs text-white/60">{user?.donate?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <img 
                    src="/beastics.svg" 
                    alt="BS" 
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span className="text-xs text-white/60">{user?.coins?.toLocaleString() ?? 0}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
