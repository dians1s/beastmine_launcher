import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';
import { useLauncherStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface SysInfo {
  cpu: string;
  cpu_cores: number;
  total_ram_gb: number;
  available_ram_gb: number;
  os: string;
  gpu: string;
}

const SystemStats = () => {
  const { systemInfo, setSystemInfo } = useLauncherStore();
  const [storageInfo, setStorageInfo] = useState({ total_gb: 0, available_gb: 0, used_by_launcher_gb: 0 });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await invoke<SysInfo>('get_system_info');
        setSystemInfo(info);

        const storage = await invoke<{ total_gb: number; available_gb: number; used_by_launcher_gb: number }>('get_storage_info');
        setStorageInfo(storage);
      } catch (error) {
        console.error('Error fetching system info:', error);
      }
    };

    fetchSystemInfo();
  }, [setSystemInfo]);

  const stats = [
    {
      icon: Cpu,
      label: 'Процессор',
      value: systemInfo?.cpu || 'Загрузка...',
      subtext: `${systemInfo?.cpu_cores || 0} ядер`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: MemoryStick,
      label: 'ОЗУ',
      value: `${systemInfo?.total_ram_gb.toFixed(1) || 0} GB`,
      subtext: `${systemInfo?.available_ram_gb.toFixed(1) || 0} GB свободно`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: HardDrive,
      label: 'Хранилище',
      value: `${storageInfo.total_gb.toFixed(0)} GB`,
      subtext: `${storageInfo.available_gb.toFixed(0)} GB свободно`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Monitor size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-white">Система</h2>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">{stat.label}</p>
                <p className="text-sm font-medium text-white truncate">{stat.value}</p>
                <p className="text-xs text-white/30">{stat.subtext}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Launcher Storage */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Лаунчер использует</span>
          <span className="text-white font-medium">{storageInfo.used_by_launcher_gb.toFixed(1)} GB</span>
        </div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(storageInfo.used_by_launcher_gb / storageInfo.total_gb) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SystemStats;
