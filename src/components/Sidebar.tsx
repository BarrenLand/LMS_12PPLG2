import React from 'react';
import { useLms } from '../context/LmsContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  UserCheck,
  FileText,
  MessageSquare,
  Calendar,
  Award,
  Users,
  Code2,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Database,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentUser, activeTab, setActiveTab, tasks, attendanceSessions, mongoStatus } = useLms();

  // Compute pending indicators
  const activeSessionCount = attendanceSessions.filter((s) => s.isOpen).length;
  const pendingTasksCount = tasks.length;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navItems = [
    {
      section: 'AKADEMIK & BELAJAR',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'classes',
          label: 'Kelas & Mata Pelajaran',
          icon: BookOpen,
          badge: null,
        },
        {
          id: 'tasks',
          label: 'Tugas & Google Drive',
          icon: FileCheck,
          badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null,
          badgeColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
        },
        {
          id: 'attendance',
          label: 'Presensi & Kehadiran',
          icon: UserCheck,
          badge: activeSessionCount > 0 ? 'Live' : null,
          badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold animate-pulse',
        },
        {
          id: 'materials',
          label: 'Modul & Materi',
          icon: FileText,
          badge: null,
        },
        {
          id: 'forum',
          label: 'Forum Diskusi',
          icon: MessageSquare,
          badge: null,
        },
        {
          id: 'schedule',
          label: 'Jadwal Pelajaran',
          icon: Calendar,
          badge: null,
        },
        {
          id: 'gradebook',
          label: 'Rapor & Rekap Nilai',
          icon: Award,
          badge: null,
        },
      ],
    },
    {
      section: 'ADMINISTRASI & SISTEM',
      items: [
        {
          id: 'users',
          label: 'Manajemen Siswa & Guru',
          icon: Users,
          badge: currentUser.role === 'admin' ? 'Admin' : null,
          badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
        },
      ],
    },
    {
      section: 'PENGEMBANG & INTEGRASI',
      items: [
        {
          id: 'golang_code',
          label: 'Arsitektur Backend Go',
          icon: Code2,
          badge: 'Go + Mongo',
          badgeColor: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-mono',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.section}
              </div>
              <div className="space-y-0.5 mt-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom System & Engine Status */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="font-bold text-slate-700 dark:text-slate-200">Go 1.22 REST Engine</div>
                <div className="text-[10px] text-slate-400">MongoDB Persistence</div>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('golang_code')}
              className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              title="Lihat Arsitektur Go"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
