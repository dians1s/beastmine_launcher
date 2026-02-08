import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, Volume2, FolderOpen, Globe, Bell, 
  Palette, RefreshCw, HardDrive, Save
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';

const Settings = () => {
  const { systemInfo } = useLauncherStore();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General
    language: 'ru',
    theme: 'dark',
    autoUpdate: true,
    minimizeToTray: true,
    
    // Game
    closeOnLaunch: false,
    showConsole: false,
    keepLauncherOpen: true,
    
    // Notifications
    notifyUpdates: true,
    notifyFriends: true,
    notifySound: true,
    
    // Performance
    hardwareAcceleration: true,
    limitDownloadSpeed: false,
    downloadSpeed: 0,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    { id: 'general', label: 'Общие', icon: Monitor },
    { id: 'game', label: 'Игра', icon: Globe },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'system', label: 'Система', icon: HardDrive },
  ];

  const languages = [
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Настройки</h1>
            <p className="text-white/60 text-sm">Настройте лаунчер под себя</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-2 transition-all"
          >
            <Save size={16} />
            <span className="text-sm font-medium">Сохранить</span>
          </motion.button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                      ${activeSection === section.id 
                        ? 'bg-primary/20 text-primary border border-primary/20' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>

            {/* System Info */}
            {systemInfo && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Система
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">ОС</span>
                    <span className="text-white/70">{systemInfo.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Процессор</span>
                    <span className="text-white/70">{systemInfo.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">ОЗУ</span>
                    <span className="text-white/70">{systemInfo.total_ram_gb} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Ядер</span>
                    <span className="text-white/70">{systemInfo.cpu_cores}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-4">
            {/* General Settings */}
            {activeSection === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Monitor size={20} className="text-primary" />
                    Общие настройки
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Language */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Язык</p>
                        <p className="text-sm text-white/50">Язык интерфейса лаунчера</p>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code} className="bg-background">
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Auto Update */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Автообновление</p>
                        <p className="text-sm text-white/50">Автоматически проверять обновления</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('autoUpdate', !settings.autoUpdate)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.autoUpdate ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.autoUpdate ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>

                    {/* Minimize to Tray */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-white font-medium">Сворачивать в трей</p>
                        <p className="text-sm text-white/50">При закрытии окна сворачивать в системный трей</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('minimizeToTray', !settings.minimizeToTray)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.minimizeToTray ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.minimizeToTray ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-primary" />
                    Внешний вид
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSettingChange('theme', 'dark')}
                      className={`
                        p-4 rounded-xl border transition-all text-left
                        ${settings.theme === 'dark' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                        }
                      `}
                    >
                      <div className="w-full h-20 rounded-lg bg-[#0f0a0a] mb-3 border border-white/10" />
                      <p className="text-white font-medium">Тёмная тема</p>
                      <p className="text-xs text-white/50">Классический тёмный вид</p>
                    </button>
                    
                    <button
                      onClick={() => handleSettingChange('theme', 'auto')}
                      className={`
                        p-4 rounded-xl border transition-all text-left
                        ${settings.theme === 'auto' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                        }
                      `}
                    >
                      <div className="w-full h-20 rounded-lg bg-gradient-to-br from-[#0f0a0a] to-[#1a1212] mb-3 border border-white/10" />
                      <p className="text-white font-medium">Авто</p>
                      <p className="text-xs text-white/50">Следовать системной теме</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Game Settings */}
            {activeSection === 'game' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-primary" />
                    Настройки игры
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Keep Launcher Open */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Держать лаунчер открытым</p>
                        <p className="text-sm text-white/50">Не закрывать лаунчер при запуске игры</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('keepLauncherOpen', !settings.keepLauncherOpen)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.keepLauncherOpen ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.keepLauncherOpen ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>

                    {/* Show Console */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Показывать консоль</p>
                        <p className="text-sm text-white/50">Отображать окно консоли при запуске игры</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('showConsole', !settings.showConsole)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.showConsole ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.showConsole ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>

                    {/* Game Directory */}
                    <div className="py-3">
                      <p className="text-white font-medium mb-2">Папка игры</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value="%appdata%/.beastmine"
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70"
                        />
                        <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-all">
                          <FolderOpen size={14} />
                          Открыть
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-primary" />
                    Уведомления
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Updates */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Обновления сборок</p>
                        <p className="text-sm text-white/50">Уведомлять о выходе новых версий сборок</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifyUpdates', !settings.notifyUpdates)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.notifyUpdates ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.notifyUpdates ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>

                    {/* Friends */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Друзья</p>
                        <p className="text-sm text-white/50">Уведомлять когда друзья заходят в игру</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifyFriends', !settings.notifyFriends)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.notifyFriends ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.notifyFriends ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>

                    {/* Sound */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Volume2 size={18} className="text-white/50" />
                        <div>
                          <p className="text-white font-medium">Звуковые уведомления</p>
                          <p className="text-sm text-white/50">Воспроизводить звук при уведомлении</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifySound', !settings.notifySound)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.notifySound ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.notifySound ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* System Settings */}
            {activeSection === 'system' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HardDrive size={20} className="text-primary" />
                    Система
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Hardware Acceleration */}
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div>
                        <p className="text-white font-medium">Аппаратное ускорение</p>
                        <p className="text-sm text-white/50">Использовать GPU для отрисовки интерфейса</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('hardwareAcceleration', !settings.hardwareAcceleration)}
                        className={`
                          w-12 h-6 rounded-full transition-all relative
                          ${settings.hardwareAcceleration ? 'bg-primary' : 'bg-white/20'}
                        `}
                      >
                        <div className={`
                          absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all
                          ${settings.hardwareAcceleration ? 'left-6' : 'left-0.5'}
                        `} />
                      </button>
                    </div>

                    {/* Clear Cache */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-white font-medium">Очистить кэш</p>
                        <p className="text-sm text-white/50">Освободить место, удалив временные файлы</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all">
                        Очистить
                      </button>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">О лаунчере</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/50">Версия</span>
                      <span className="text-white">v1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/50">Разработчик</span>
                      <span className="text-white">BeastMine Team</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-white/50">Лицензия</span>
                      <span className="text-white">MIT</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={14} />
                      Проверить обновления
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
