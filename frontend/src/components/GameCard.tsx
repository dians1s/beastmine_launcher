import { motion } from 'framer-motion';
import { Check, Download, Star } from 'lucide-react';

interface GameCardProps {
  name: string;
  type: 'release' | 'snapshot' | 'modded';
  isSelected: boolean;
  onClick: () => void;
}

const GameCard = ({ name, type, isSelected, onClick }: GameCardProps) => {
  const typeColors = {
    release: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    snapshot: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    modded: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  };

  const typeLabels = {
    release: 'Релиз',
    snapshot: 'Снапшот',
    modded: 'Модификация',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full p-4 rounded-2xl border transition-all duration-300 text-left
        ${isSelected 
          ? `bg-gradient-to-br ${typeColors[type]} border-2` 
          : 'bg-background-card border-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Background glow */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl"
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className={`
            text-xs font-medium px-2 py-0.5 rounded-full
            ${type === 'release' ? 'bg-green-500/20 text-green-400' : ''}
            ${type === 'snapshot' ? 'bg-yellow-500/20 text-yellow-400' : ''}
            ${type === 'modded' ? 'bg-purple-500/20 text-purple-400' : ''}
          `}>
            {typeLabels[type]}
          </span>
          
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
            >
              <Check size={12} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-white mb-1">{name}</h3>
        <p className="text-sm text-white/40">Установлено</p>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Download size={12} />
            <span>500 MB</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Star size={12} />
            <span>4.8</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default GameCard;
