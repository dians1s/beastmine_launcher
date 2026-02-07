import { motion } from 'framer-motion';
import { 
  Gamepad2, Settings, User, Package, Gem, Coins
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { sidebarCollapsed, user } = useLauncherStore();

  const menuItems = [
    { id: 'play', icon: Gamepad2, label: 'Играть' },
    { id: 'profile', icon: User, label: 'Профиль' },
    { id: 'modpacks', icon: Package, label: 'Модпаки' },
    { id: 'skins', icon: User, label: 'Скины' },
    { id: 'settings', icon: Settings, label: 'Настройки' },
  ];

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Gamepad2 size={20} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-white whitespace-nowrap">BeastMine</span>
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

      {/* Currencies Section */}
      {!sidebarCollapsed && (
        <div className="px-3 pb-3">
          <div className="glass rounded-xl p-3 space-y-2">
            {/* Donate */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Gem size={14} className="text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">Донат</p>
                <p className="text-sm font-medium text-white truncate">
                  {user?.donate?.toLocaleString() ?? 0}
                </p>
              </div>
            </div>
            
            {/* Coins */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Coins size={14} className="text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">Coins</p>
                <p className="text-sm font-medium text-white truncate">
                  {user?.coins?.toLocaleString() ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User - no drag */}
      <div className="p-3 border-t border-white/5 no-drag">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            flex items-center gap-3 p-2 rounded-xl bg-white/5 cursor-pointer no-drag
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
