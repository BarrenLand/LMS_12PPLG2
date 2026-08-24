import React, { useEffect, useState, useRef } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Clock,
  ShieldAlert,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const AutoLogoutWarningModal: React.FC = () => {
  const {
    isLoggedIn,
    isWarningModalOpen,
    warningRemainingSeconds,
    extendSession,
    logout,
    currentUser,
    inactivityTimeoutMinutes,
    setInactivityTimeoutMinutes,
  } = useLms();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play subtle synth chime on open
  useEffect(() => {
    if (isWarningModalOpen && soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;

          // Two-tone warm warning chime
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(587.33, now); // D5
          osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
          gain1.gain.setValueAtTime(0.08, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc1.connect(gain1);
          gain1.connect(ctx.destination);

          osc1.start(now);
          osc1.stop(now + 0.55);
        }
      } catch (err) {
        // Audio synthesis fallback silently ignored if blocked by browser policy
      }
    }
  }, [isWarningModalOpen, soundEnabled]);

  // Keyboard shortcut listener (Enter = Extend Session)
  useEffect(() => {
    if (!isWarningModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        extendSession();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWarningModalOpen, extendSession]);

  if (!isLoggedIn || !isWarningModalOpen) return null;

  // Percentage for circular / linear progress (60s down to 0s)
  const maxWarningSec = inactivityTimeoutMinutes <= 1 ? 30 : 60;
  const progressPercent = Math.max(0, Math.min(100, (warningRemainingSeconds / maxWarningSec) * 100));

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isUrgent = warningRemainingSeconds <= 15;

  return (
    <div
      id="auto-logout-warning-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        id="auto-logout-warning-card"
        className="w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Top Glowing Header Banner */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-rose-950/40 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
                  isUrgent
                    ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/30'
                    : 'bg-amber-500 text-white shadow-amber-500/30'
                }`}
              >
                {isUrgent ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="modal-title"
                    className="text-lg font-black text-slate-900 dark:text-white tracking-tight"
                  >
                    Peringatan Sesi Berakhir
                  </h2>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      isUrgent
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    Inaktivitas
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Session Inactivity & Security Protection
                </p>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Notifikasi Suara' : 'Aktifkan Notifikasi Suara'}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Digital Countdown Timer Hero */}
          <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Animated Background Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  isUrgent ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Sisa Waktu Respons
            </div>

            <div className="flex items-baseline gap-2 font-mono">
              <span
                className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  isUrgent
                    ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {formatSeconds(warningRemainingSeconds)}
              </span>
              <span className="text-xs font-bold text-slate-400">detik</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm">
              Sistem tidak mendeteksi aktivitas pengguna. Demi melindungi keamanan akun Anda, Anda akan dikeluarkan otomatis saat hitungan mundur mencapai nol.
            </p>
          </div>

          {/* User Account Snapshot */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Timeout Settings Quick Toggle */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1.5 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {showSettings ? 'Sembunyikan Pengaturan Durasi' : `Durasi Inaktivitas Saat Ini: ${inactivityTimeoutMinutes} Menit (Ubah)`}
              </span>
            </button>

            {showSettings && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 space-y-2 animate-in fade-in-50 duration-150">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Batas Waktu Inaktivitas:
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 5, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setInactivityTimeoutMinutes(mins)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition text-center ${
                        inactivityTimeoutMinutes === mins
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">
                  Pilih 1m untuk pengujian cepat atau 5m-15m untuk penggunaan harian normal.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* Secondary Action: Logout Immediately */}
            <button
              id="btn-modal-logout-now"
              onClick={logout}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sekarang</span>
            </button>

            {/* Primary Action: Extend Session */}
            <button
              id="btn-modal-extend-session"
              onClick={extendSession}
              className="w-full sm:flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Perpanjang Sesi (Tetap Masuk)</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-indigo-700/80 text-[10px] font-mono text-indigo-100">
                ↵ Enter
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
