import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
        />
        
        {/* Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-2xl"
        >
          <Gamepad2 size={48} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-2xl font-bold gradient-text"
      >
        BeastMine Launcher
      </motion.h1>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex items-center gap-2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
        />
        <span className="text-white/60 text-sm">Загрузка...</span>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 200 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-1/3 bg-gradient-to-r from-primary to-accent rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default Loading;
