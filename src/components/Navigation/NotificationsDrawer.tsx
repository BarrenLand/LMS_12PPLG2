import React from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  X,
  ArrowRight,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useLms();

  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      type: 'attendance',
      title: 'Sesi Presensi Dibuka',
      message: 'Presensi mandiri dibuka untuk kelas Pemrograman Web & Go (PPLG 2).',
      time: '10 menit yang lalu',
      unread: true,
      actionTab: 'attendance',
      icon: UserCheck,
      color: 'emerald',
    },
    {
      id: 'notif-2',
      type: 'task',
      title: 'Tugas Mendekati Deadline',
      message: 'Tugas "REST API Golang dengan Fiber" jatuh tempo dalam 24 jam.',
      time: '1 jam yang lalu',
      unread: true,
      actionTab: 'tasks',
      icon: Clock,
      color: 'amber',
    },
    {
      id: 'notif-3',
      type: 'grade',
      title: 'Nilai Diterbitkan',
      message: 'Pak Daniel telah menilai tugas "Implementasi Middleware Auth" (Nilai: 95/100).',
      time: '3 jam yang lalu',
      unread: false,
      actionTab: 'gradebook',
      icon: CheckCircle2,
      color: 'indigo',
    },
    {
      id: 'notif-4',
      type: 'material',
      title: 'Materi Baru Ditambahkan',
      message: 'Modul 04: "Database MongoDB Aggregation Pipeline" telah diupload.',
      time: 'Kemarin',
      unread: false,
      actionTab: 'materials',
      icon: FileText,
      color: 'sky',
    },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-sm h-full bg-white dark:bg-[#111827] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifikasi</h3>
              <p className="text-[11px] text-slate-400">2 pesan belum dibaca</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => handleNavigate(n.actionTab)}
                className={`p-3.5 rounded-xl border transition cursor-pointer group ${
                  n.unread
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40'
                    : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                      n.color === 'emerald'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : n.color === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        : n.color === 'indigo'
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                        {n.title}
                      </h4>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                      <span>{n.time}</span>
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                        Buka <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
          <button
            onClick={() => handleNavigate('tasks')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
};
