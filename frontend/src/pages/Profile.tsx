import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Copy, Check, LogOut } from 'lucide-react';
import { useLauncherStore } from '../store/useStore';
import { api } from '../utils/api';

const Profile = () => {
  const { user, setUser, logout } = useLauncherStore();
  const [, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Загрузка данных профиля при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const result = await api.getPlayerInfo();
        
        if (result.data) {
          setUser({
            ...user!,
            donate: result.data.donate,
            coins: result.data.coins,
            email: result.data.email,
            role: result.data.role,
            create_date: result.data.create_date,
            last_date: result.data.last_date,
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, []);

  const copyUuid = () => {
    if (user?.uuid) {
      navigator.clipboard.writeText(user.uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
    }
  };

  // Ссылка на скин
  const skinUrl = user?.username 
    ? `https://beastmine.ru/skins/${user.username}.png`
    : null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Нет данных';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Ошибка даты';
    }
  };

  const getRoleName = (role?: number) => {
    const roles: Record<number, string> = {
      0: 'Игрок',
      1: 'VIP',
      2: 'Premium',
      3: 'Deluxe',
      4: 'Legend',
      5: 'Sponsor',
      6: 'YouTube',
      7: 'Admin',
      99: 'Dev',
    };
    return roles[role ?? 0] || 'Игрок';
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-4"
      >
        {/* Main Profile Card */}
        <div className="glass rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Skin Preview - лицо персонажа */}
            <div className="flex-shrink-0">
              {skinUrl ? (
                <div 
                  className="w-20 h-20 rounded-xl overflow-hidden shadow-lg"
                  style={{
                    backgroundImage: `url(${skinUrl})`,
                    backgroundSize: '640px',
                    backgroundPosition: '-80px -80px',
                    imageRendering: 'pixelated',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-background-card border border-white/10 flex items-center justify-center text-white/30">
                  <User size={40} />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                <p className="text-white/60 text-sm">{getRoleName(user?.role)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <Mail size={14} className="text-primary" />
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-sm text-white">{user?.email}</p>
                  </div>
                </div>

                <div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={copyUuid}
                >
                  <Shield size={14} className="text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40">UUID</p>
                    <p className="text-sm text-white truncate">{user?.uuid}</p>
                  </div>
                  {copied ? (
                    <Check size={12} className="text-success" />
                  ) : (
                    <Copy size={12} className="text-white/40" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* BeastCoins - платная валюта */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center p-2">
                <img src="/beastcoin.svg" alt="BC" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-white/60 text-xs">BeastCoins</p>
                <p className="text-xl font-bold text-white">{user?.donate ?? 0}</p>
              </div>
            </div>
          </motion.div>

          {/* BeastStics - бесплатная валюта */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center p-2">
                <img src="/beastics.svg" alt="BS" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-white/60 text-xs">BeastStics</p>
                <p className="text-xl font-bold text-white">{user?.coins ?? 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-primary" />
            <h3 className="text-base font-semibold text-white">Статистика</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-white/40 mb-1">Регистрация</p>
              <p className="text-sm text-white">{formatDate(user?.create_date)}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-white/40 mb-1">Последний вход</p>
              <p className="text-sm text-white">{formatDate(user?.last_date)}</p>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 text-error hover:bg-error/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Выйти из аккаунта</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
