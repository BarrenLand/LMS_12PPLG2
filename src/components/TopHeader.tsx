import React, { useState } from 'react';
import { useLms } from '../context/LmsContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  ShieldCheck,
  Clock,
  Sliders,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import { QuickSearchModal } from './Navigation/QuickSearchModal';
import { NotificationsDrawer } from './Navigation/NotificationsDrawer';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    users,
    switchUser,
    logout,
    theme,
    toggleTheme,
    inactivityTimeoutMinutes,
    setInactivityTimeoutMinutes,
    triggerAutoLogoutWarningTest,
  } = useLms();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);

  // Fast switch targets
  const teacherUser = users.find((u) => u.role === 'guru' || u.role === 'teacher') || users[0];
  const studentUser = users.find((u) => u.role === 'murid' || u.role === 'student') || users[1];
  const adminUser = users.find((u) => u.role === 'admin') || users[2];
  const waliUser = users.find((u) => u.role === 'wali_kelas') || users[3];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'guru':
      case 'teacher':
        return { label: 'Guru / Dosen', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'admin':
        return { label: 'Administrator', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      case 'wali_kelas':
        return { label: 'Wali Kelas', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      default:
        return { label: 'Murid / Siswa', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-xs">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Brand & Mobile Toggle */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black text-base shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-500/20">
                A
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-sky-600 dark:from-indigo-400 dark:to-sky-400 bg-clip-text text-transparent">
                    SMK Citra Negara
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 -mt-0.5">
                  Learning Management System
                </div>
              </div>
            </div>

            {/* Academic Term Tag */}
            <div className="hidden 2xl:flex items-center gap-2 ml-3 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                Ganjil 2025/2026
              </span>
              <span className="text-slate-400 whitespace-nowrap">• Pekan Ke-8</span>
            </div>
          </div>

          {/* Center: Quick Search Bar Button */}
          <div className="hidden md:flex flex-1 min-w-[200px] sm:min-w-[240px] max-w-md mx-2">
            <button
              onClick={() => setShowSearchModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-400 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 text-xs transition group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 font-normal truncate whitespace-nowrap text-left block">
                  Cari kelas, materi, tugas, siswa...
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  Ctrl
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right: Quick Role Switcher + Notifications + Theme + User */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Role Switcher Pills (Visible on large screens) */}
            <div className="hidden xl:flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold gap-0.5 shrink-0">
              <button
                onClick={() => studentUser && switchUser(studentUser.id)}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 whitespace-nowrap ${
                  currentUser.role === 'murid' || currentUser.role === 'student'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Beralih ke Akun Murid"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Murid</span>
              </button>
              <button
                onClick={() => teacherUser && switchUser(teacherUser.id)}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 whitespace-nowrap ${
                  currentUser.role === 'guru' || currentUser.role === 'teacher'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Beralih ke Akun Guru"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guru</span>
              </button>
              <button
                onClick={() => waliUser && switchUser(waliUser.id)}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 whitespace-nowrap ${
                  currentUser.role === 'wali_kelas'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Beralih ke Akun Wali Kelas"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Wali</span>
              </button>
              <button
                onClick={() => adminUser && switchUser(adminUser.id)}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 whitespace-nowrap ${
                  currentUser.role === 'admin'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Beralih ke Akun Admin"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Pencarian"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Session Security Indicator Pill */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowSessionMenu(!showSessionMenu)}
                title="Status Keamanan Sesi & Auto-Logout"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden lg:inline text-[11px]">Auto-Logout:</span>
                <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                  {inactivityTimeoutMinutes}m
                </span>
              </button>

              {/* Session Menu Dropdown */}
              {showSessionMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in-50 duration-100 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Keamanan Sesi
                        </div>
                        <div className="text-[10px] text-slate-400">Monitoring Inaktivitas</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Batas Waktu Tidak Aktif:
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 5, 15, 30].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => {
                            setInactivityTimeoutMinutes(mins);
                          }}
                          className={`py-1 rounded-lg text-xs font-bold transition text-center ${
                            inactivityTimeoutMinutes === mins
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowSessionMenu(false);
                        triggerAutoLogoutWarningTest();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Uji Peringatan Auto-Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                    {roleInfo.label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Menu Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in-50 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>

                  <div className="p-1 space-y-0.5 text-xs">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Ganti Akun Demo:
                    </div>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition ${
                          u.id === currentUser.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate flex-1">{u.name}</span>
                        <span className="text-[10px] uppercase text-slate-400 font-medium">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-1 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        triggerAutoLogoutWarningTest();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Uji Peringatan Auto-Logout</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <QuickSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />

      {/* Notifications Slide Drawer */}
      <NotificationsDrawer isOpen={showNotifDrawer} onClose={() => setShowNotifDrawer(false)} />
    </>
  );
};
