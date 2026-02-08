import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Trash2, Play, Settings, Check, X,
  HardDrive, Maximize, Terminal, ChevronUp,
  Boxes, Cpu
} from 'lucide-react';
import { useLauncherStore } from '../store/useStore';

const Builds = () => {
  const { 
    builds, 
    selectedBuild, 
    setSelectedBuild, 
    installBuild, 
    uninstallBuild,
    updateBuildSettings,
    isGameRunning,
    setGameRunning,
    systemInfo
  } = useLauncherStore();
  
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const totalRam = systemInfo ? Math.floor(systemInfo.total_ram_gb * 1024) : 16384;
  const minRam = 1024;
  const maxRam = totalRam; // Используем реальное ОЗУ системы без ограничения

  const handleLaunch = async (buildId: string) => {
    if (isGameRunning) {
      setGameRunning(false);
    } else {
      setIsLaunching(true);
      setSelectedBuild(buildId);
      try {
        console.log(`Launching build: ${buildId}`);
        setGameRunning(true);
      } catch (error) {
        console.error('Launch error:', error);
      } finally {
        setIsLaunching(false);
      }
    }
  };

  const toggleExpand = (buildId: string) => {
    setExpandedBuild(expandedBuild === buildId ? null : buildId);
  };

  const formatRam = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  // Группируем сборки: сначала установленные, потом неустановленные
  const sortedBuilds = [...builds].sort((a, b) => {
    if (a.installed && !b.installed) return -1;
    if (!a.installed && b.installed) return 1;
    return 0;
  });

  return (
    <div className="h-full p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Boxes size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Сборки</h1>
              <p className="text-white/60 text-sm">
                {builds.filter(b => b.installed).length} установлено из {builds.length}
              </p>
            </div>
          </div>
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedBuilds.map((build, index) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300
                ${!build.installed 
                  ? 'border-white/5 bg-white/[0.02] opacity-60 grayscale' 
                  : selectedBuild === build.id 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]'
                }
              `}
            >
              <div className="flex">
                {/* Build Image - Left Side */}
                <div className="relative w-40 h-full flex-shrink-0">
                  <img 
                    src={build.image} 
                    alt={build.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
                  
                  {/* Version Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                    {build.version}
                  </div>
                  
                  {/* Installed Badge */}
                  {build.installed && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-green-500/90 text-xs font-semibold text-white flex items-center gap-1">
                      <Check size={10} />
                      <span className="hidden sm:inline">Установлена</span>
                    </div>
                  )}
                </div>

                {/* Build Info - Right Side */}
                <div className="flex-1 p-4 flex flex-col">
                  {/* Title Row */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{build.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                        <Cpu size={12} />
                        <span>{build.mod_count} модов</span>
                        {selectedBuild === build.id && build.installed && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                            Выбрана
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-white/60 line-clamp-2 mb-3 flex-1">
                    {build.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto">
                    {build.installed ? (
                      <>
                        <motion.button
                          onClick={() => handleLaunch(build.id)}
                          disabled={isLaunching}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all
                            ${isGameRunning && selectedBuild === build.id
                              ? 'bg-red-500 hover:bg-red-400 text-white' 
                              : 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40'
                            }
                          `}
                        >
                          {isLaunching && selectedBuild === build.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Запуск...
                            </>
                          ) : isGameRunning && selectedBuild === build.id ? (
                            <>
                              <X size={16} />
                              Остановить
                            </>
                          ) : (
                            <>
                              <Play size={16} fill="currentColor" />
                              Играть
                            </>
                          )}
                        </motion.button>
                        
                        <motion.button
                          onClick={() => toggleExpand(build.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            w-9 h-9 rounded-lg flex items-center justify-center transition-all
                            ${expandedBuild === build.id 
                              ? 'bg-white/15 text-white' 
                              : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/15'
                            }
                          `}
                          title="Настройки"
                        >
                          {expandedBuild === build.id ? <ChevronUp size={16} /> : <Settings size={16} />}
                        </motion.button>
                        
                        <motion.button
                          onClick={() => uninstallBuild(build.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-lg bg-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => installBuild(build.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <Download size={16} />
                        Установить
                      </motion.button>
                    )}
                  </div>

                  {/* Settings Panel */}
                  <AnimatePresence>
                    {expandedBuild === build.id && build.installed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-3">
                            {/* RAM Slider */}
                            <div className="col-span-2 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/70">
                                  <HardDrive size={14} />
                                  <span className="text-sm">Выделение ОЗУ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={Math.round(build.settings.ram_mb / 1024 * 10) / 10}
                                    onChange={(e) => {
                                      const gb = parseFloat(e.target.value);
                                      if (!isNaN(gb) && gb >= 1 && gb <= maxRam / 1024) {
                                        updateBuildSettings(build.id, { ram_mb: Math.round(gb * 1024) });
                                      }
                                    }}
                                    min={1}
                                    max={Math.round(maxRam / 1024)}
                                    step={0.5}
                                    className="w-16 px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-sm text-white text-center focus:outline-none focus:border-primary/50"
                                  />
                                  <span className="text-sm text-white/50">GB</span>
                                </div>
                              </div>
                              
                              {/* Большой удобный ползунок */}
                              <div className="relative py-2">
                                <input
                                  type="range"
                                  min={minRam}
                                  max={maxRam}
                                  step={256}
                                  value={build.settings.ram_mb}
                                  onChange={(e) => updateBuildSettings(build.id, { ram_mb: parseInt(e.target.value) })}
                                  className="w-full h-3 rounded-full bg-white/10 appearance-none cursor-pointer 
                                    [&::-webkit-slider-thumb]:appearance-none 
                                    [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary 
                                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/50
                                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20
                                    [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 
                                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                                    [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/20"
                                />
                                {/* Метки на ползунке */}
                                <div className="flex justify-between text-[10px] text-white/40 mt-2">
                                  <span>1 GB</span>
                                  <span>{Math.round(maxRam / 2048)} GB</span>
                                  <span>{Math.round(maxRam / 1024)} GB</span>
                                </div>
                              </div>
                              
                              {systemInfo && (
                                <div className="flex items-center gap-4 text-xs text-white/50">
                                  <span>Всего: <span className="text-white/70">{formatRam(systemInfo.total_ram_gb * 1024)}</span></span>
                                  <span>•</span>
                                  <span>Доступно: <span className="text-white/70">{formatRam(systemInfo.available_ram_gb * 1024)}</span></span>
                                </div>
                              )}
                            </div>

                            {/* Fullscreen Toggle */}
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                              <div className="flex items-center gap-1.5 text-xs text-white/60">
                                <Maximize size={12} />
                                <span>Fullscreen</span>
                              </div>
                              <button
                                onClick={() => updateBuildSettings(build.id, { fullscreen: !build.settings.fullscreen })}
                                className={`
                                  w-9 h-5 rounded-full transition-all relative
                                  ${build.settings.fullscreen ? 'bg-primary' : 'bg-white/20'}
                                `}
                              >
                                <div className={`
                                  absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
                                  ${build.settings.fullscreen ? 'left-[18px]' : 'left-0.5'}
                                `} />
                              </button>
                            </div>

                            {/* Java Args */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
                                <Terminal size={12} />
                                <span>Аргументы JVM</span>
                              </div>
                              <input
                                type="text"
                                value={build.settings.java_args}
                                onChange={(e) => updateBuildSettings(build.id, { java_args: e.target.value })}
                                placeholder="-XX:+UseG1GC"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Builds;