import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { TeacherAttendance } from './TeacherAttendance';
import { StudentAttendance } from './StudentAttendance';
import { AdminAttendance } from './AdminAttendance';
import {
  UserCheck,
  Calendar,
  Users,
  Shield,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const AttendanceHubView: React.FC = () => {
  const { currentUser } = useLms();
  const [viewMode, setViewMode] = useState<'auto' | 'teacher' | 'student' | 'recap'>('auto');

  const resolvedRole =
    viewMode === 'auto'
      ? currentUser.role
      : viewMode === 'teacher'
      ? 'guru'
      : viewMode === 'student'
      ? 'murid'
      : 'admin';

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* View Switcher Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
              Pusat Presensi & Kehadiran Live
            </h1>
            <p className="text-xs text-slate-400">
              Sesi check-in mandiri mahasiswa & rekapitulasi kehadiran kelas
            </p>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setViewMode('auto')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'auto'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Sesuai Peran Aktif ({currentUser.role})
          </button>
          <button
            onClick={() => setViewMode('student')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              viewMode === 'student'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Presensi Siswa</span>
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              viewMode === 'teacher'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kelola Sesi (Guru)</span>
          </button>
          <button
            onClick={() => setViewMode('recap')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              viewMode === 'recap'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Rekap Sekolah</span>
          </button>
        </div>
      </div>

      {/* Render Sub View */}
      {resolvedRole === 'murid' || resolvedRole === 'student' ? (
        <StudentAttendance />
      ) : resolvedRole === 'admin' || viewMode === 'recap' ? (
        <AdminAttendance />
      ) : (
        <TeacherAttendance />
      )}
    </div>
  );
};
