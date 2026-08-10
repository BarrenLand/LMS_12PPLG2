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
  Sparkles,
  LogOut,
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
  } = useLms();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="w-3.5 h-3.5" /> Teacher
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <GraduationCap className="w-3.5 h-3.5" /> Student
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 font-bold text-xl">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                  Go<span className="text-cyan-600 dark:text-cyan-400">LMS</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-semibold">
                  Go 1.22 API
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Golang Learning Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {currentUser.role === 'admin'
                ? 'Admin Control'
                : currentUser.role === 'teacher'
                ? 'Teacher Dashboard'
                : 'My Learning'}
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'users'
                    ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                User Placement
              </button>
            )}

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'materials'
                  ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Study Materials
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              {currentUser.role === 'student' ? 'Tasks & GDrive' : 'Tasks & Grading'}
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'forum'
                  ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Forums
            </button>

            <button
              onClick={() => setActiveTab('golang_code')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'golang_code'
                  ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                  : 'text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Go Backend Code
            </button>
          </nav>

          {/* User Role Switcher & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetData}
              title="Reset to default mock data"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>

            <button
              onClick={logout}
              title="Sign out of current account"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/30"
                />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[120px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active Persona
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select a account to test role permissions:
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
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${
                          u.id === currentUser.id
                            ? 'bg-cyan-50/70 dark:bg-cyan-950/40 font-semibold'
                            : ''
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
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

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-2xl text-[11px] text-slate-500 space-y-2">
                    <div className="text-center">
                      Logged in as <strong className="text-slate-700 dark:text-slate-300">{currentUser.name}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out / Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'dashboard' ? 'text-cyan-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Home
        </button>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
              activeTab === 'users' ? 'text-cyan-600 font-bold' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4" />
            Users
          </button>
        )}
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'materials' ? 'text-cyan-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Materials
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'tasks' ? 'text-cyan-600 font-bold' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'forum' ? 'text-cyan-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Forum
        </button>
        <button
          onClick={() => setActiveTab('golang_code')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
            activeTab === 'golang_code' ? 'text-cyan-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Go Code
        </button>
      </div>
    </header>
  );
};
