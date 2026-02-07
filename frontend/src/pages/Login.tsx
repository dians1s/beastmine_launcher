import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, Gamepad2, Shield } from 'lucide-react';
import { useLauncherStore } from '../store/useStore';
import { api } from '../utils/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const { setUser } = useLauncherStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await api.loginLauncher(username, password, otpCode || undefined);

      if (result.data) {
        // Save user data with currencies
        setUser({
          uuid: result.data.uuid,
          username: result.data.username,
          email: result.data.email,
          privileges: [], // Will be fetched separately
          donate: result.data.donate,
          coins: result.data.coins,
          role: result.data.role,
          id: result.data.id,
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Ошибка входа';
      
      // Check specific error messages from API
      if (errorMessage === 'Enter 2FA verification code') {
        // 2FA is required - show OTP input
        setShowOtp(true);
        setError('');
      } else if (errorMessage === 'Invalid 6-digit code from app') {
        // Wrong 2FA code
        setError('Неверный код двухфакторной аутентификации');
      } else if (errorMessage === 'Invalid credentials') {
        setError('Неверное имя пользователя или пароль');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Gamepad2 size={32} className="text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold text-white mb-2">
                {showOtp ? 'Двухфакторная аутентификация' : 'Добро пожаловать'}
              </h1>
              <p className="text-white/60 text-sm">
                {showOtp 
                  ? 'Введите код из приложения аутентификатора' 
                  : 'Войдите в свой аккаунт BeastMine'}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!showOtp && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Имя пользователя"
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {showOtp && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Код 2FA (6 цифр)"
                      maxLength={6}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-center tracking-widest"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error text-sm text-center bg-error/10 py-2 px-4 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {showOtp ? 'Подтвердить' : 'Войти'}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              {showOtp && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowOtp(false);
                    setOtpCode('');
                    setError('');
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-white/60 hover:text-white text-sm py-2"
                >
                  ← Назад
                </motion.button>
              )}
            </form>

            {!showOtp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-white/40 text-xs">
                  Нет аккаунта?{' '}
                  <a 
                    href="https://beastmine.ru/register" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light transition-colors"
                  >
                    Зарегистрироваться
                  </a>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
