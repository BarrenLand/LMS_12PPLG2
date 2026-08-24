import React, { useState } from 'react';
import { useLms } from '../context/LmsContext';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User,
  Code2,
  BookOpen,
  FileText,
  MessageSquare,
  LayoutDashboard,
  ChevronDown,
  RotateCcw,
  LogOut,
  School,
  Database,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    activeTab,
    setActiveTab,
    resetData,
    logout,
    mongoStatus,
  } = useLms();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#064e3b] text-emerald-100 border border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" /> Admin
          </span>
        );
      case 'guru':
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10b981] text-white border border-[#059669]">
            <UserCheck className="w-3.5 h-3.5" /> Guru
          </span>
        );
      case 'wali_kelas':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#064e3b] border border-emerald-300">
            <School className="w-3.5 h-3.5 text-[#059669]" /> Wali Kelas
          </span>
        );
      case 'murid':
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#34d399]/20 text-[#064e3b] border border-[#34d399]/50">
            <GraduationCap className="w-3.5 h-3.5 text-[#059669]" /> Murid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#064e3b] backdrop-blur-md border-b border-emerald-100 dark:border-emerald-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo in 3 Shades of Green */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#064e3b] via-[#059669] to-[#34d399] flex items-center justify-center text-white shadow-md shadow-emerald-900/15 font-bold">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#064e3b] dark:text-white text-lg tracking-tight">
                  cornerstone<span className="text-[#10b981] font-light">lms</span>
                </span>
                <span
                  title={
                    mongoStatus.connected
                      ? `MongoDB Connected (${mongoStatus.uri})`
                      : `MongoDB Status: ${mongoStatus.error || 'Disconnected (Using Local DB)'}`
                  }
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    mongoStatus.connected
                      ? 'bg-emerald-100 text-[#064e3b] border border-emerald-300'
                      : 'bg-emerald-50 text-[#059669] border border-emerald-200'
                  }`}
                >
                  <Database className="w-3 h-3 text-[#10b981]" />
                  {mongoStatus.connected ? 'DB Online' : 'DB Local'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-emerald-200 font-medium">
                Integrated Learning Management Suite
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#10b981] text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-[#064e3b]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {currentUser.role === 'admin'
                ? 'Admin Control'
                : currentUser.role === 'wali_kelas'
                ? 'Portal Wali Kelas'
                : currentUser.role === 'guru' || currentUser.role === 'teacher'
                ? 'Dashboard Guru'
                : 'Portal Murid'}
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'users'
                    ? 'bg-[#10b981] text-white shadow-sm shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-[#064e3b]'
                }`}
              >
                <User className="w-4 h-4" />
                User Placement
              </button>
            )}

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'materials'
                  ? 'bg-[#10b981] text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-[#064e3b]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Materials
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-[#10b981] text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-[#064e3b]'
              }`}
            >
              <FileText className="w-4 h-4" />
              {currentUser.role === 'student' || currentUser.role === 'murid' ? 'Tasks & GDrive' : 'Tasks & Grading'}
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'forum'
                  ? 'bg-[#10b981] text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-[#064e3b]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Discussion Forum
            </button>

            <button
              onClick={() => setActiveTab('golang_code')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'golang_code'
                  ? 'bg-[#064e3b] text-white shadow-sm'
                  : 'text-[#059669] dark:text-[#34d399] hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Go Architecture
            </button>
          </nav>

          {/* User Role Switcher & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetData}
              title="Reset to default mock data"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#064e3b] dark:text-emerald-200 dark:hover:text-white px-2.5 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>

            <button
              onClick={logout}
              title="Sign out of current account"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#064e3b] dark:text-emerald-200 dark:hover:text-white px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-[#064e3b] hover:bg-emerald-50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Account
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-emerald-900/50 hover:bg-emerald-50 transition shadow-sm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#10b981]"
                />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#064e3b] dark:text-white max-w-[120px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#059669]" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs font-bold text-[#064e3b] dark:text-emerald-300 uppercase tracking-wider">
                      Switch Active Account
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select persona to test permissions:
                    </p>
                  </div>

                  <div className="max-h-64 overflow-y-auto py-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition ${
                          u.id === currentUser.id
                            ? 'bg-emerald-50/80 dark:bg-emerald-900/40 font-semibold'
                            : ''
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-emerald-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#064e3b] dark:text-slate-100 truncate">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {u.email}
                          </p>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-emerald-100 dark:border-slate-800 bg-[#f4fbf7] dark:bg-slate-950/50 rounded-b-2xl text-[11px] text-slate-600 space-y-2">
                    <div className="text-center font-medium">
                      Active: <strong className="text-[#064e3b] dark:text-emerald-300">{currentUser.name}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-emerald-900 border border-emerald-200 text-[#064e3b] dark:text-white text-xs font-bold transition flex items-center justify-center gap-2 hover:bg-emerald-50"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#059669]" />
                      Sign Out / Back to Showcase
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-emerald-100 dark:border-emerald-800 px-2 py-2 overflow-x-auto bg-white dark:bg-[#064e3b]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'dashboard' ? 'text-[#059669] font-bold' : 'text-slate-500 dark:text-emerald-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Home
        </button>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
              activeTab === 'users' ? 'text-[#059669] font-bold' : 'text-slate-500 dark:text-emerald-200'
            }`}
          >
            <User className="w-4 h-4" />
            Users
          </button>
        )}
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'materials' ? 'text-[#059669] font-bold' : 'text-slate-500 dark:text-emerald-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Materials
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'tasks' ? 'text-[#059669] font-bold' : 'text-slate-500 dark:text-emerald-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'forum' ? 'text-[#059669] font-bold' : 'text-slate-500 dark:text-emerald-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Forum
        </button>
        <button
          onClick={() => setActiveTab('golang_code')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'golang_code' ? 'text-[#059669] font-bold' : 'text-slate-500 dark:text-emerald-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Go Code
        </button>
      </div>
    </header>
  );
};

