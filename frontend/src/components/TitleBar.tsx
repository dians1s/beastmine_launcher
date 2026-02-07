import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, X, Monitor } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

const TitleBar = () => {
  const [appWindow, setAppWindow] = useState<any>(null);

  useEffect(() => {
    const initWindow = async () => {
      try {
        const currentWindow = await getCurrentWindow();
        setAppWindow(currentWindow);
      } catch (error) {
        console.error('Failed to get current window:', error);
      }
    };
    initWindow();
  }, []);

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
    <div 
      className="h-8 glass flex items-center justify-between select-none"
      data-tauri-drag-region
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-full" data-tauri-drag-region>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-5 h-5 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <Monitor size={12} className="text-white" />
        </motion.div>
        <span className="text-sm font-medium text-white/80">BeastMine Launcher</span>
      </div>

      {/* Controls */}
      <div className="flex items-center h-full no-drag">
        <button
          onClick={handleMinimize}
          className="h-full w-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer bg-transparent border-none"
        >
          <Minus size={14} />
        </button>
        
        <button
          onClick={handleClose}
          className="h-full w-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 transition-colors cursor-pointer bg-transparent border-none"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
