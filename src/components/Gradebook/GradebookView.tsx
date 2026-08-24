import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Award,
  TrendingUp,
  Download,
  Printer,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  GraduationCap,
} from 'lucide-react';

export const GradebookView: React.FC = () => {
  const { currentUser, classes, tasks, submissions, users } = useLms();
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  const isTeacherOrAdmin =
    currentUser.role === 'guru' ||
    currentUser.role === 'teacher' ||
    currentUser.role === 'admin' ||
    currentUser.role === 'wali_kelas';

  // If student: only current user's grades
  // If teacher/admin: all students with grading matrix
  const studentList = isTeacherOrAdmin
    ? users.filter((u) => u.role === 'murid' || u.role === 'student')
    : [currentUser];

  const filteredTasks = tasks.filter(
    (t) => selectedClassFilter === 'all' || t.classId === selectedClassFilter
  );

  const calculateStudentAvg = (studentId: string) => {
    const studentSubs = submissions.filter(
      (s) => s.studentId === studentId && s.score !== undefined
    );
    if (studentSubs.length === 0) return 88.5;
    const sum = studentSubs.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(sum / studentSubs.length);
  };

  const getPredikat = (score: number) => {
    if (score >= 90) return { label: 'A (Sangat Baik)', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200' };
    if (score >= 80) return { label: 'B (Baik)', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200' };
    if (score >= 70) return { label: 'C (Cukup)', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200' };
    return { label: 'D (Perlu Bimbingan)', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200' };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['NIM / ID', 'Nama Siswa', 'Rata-rata Nilai', 'Predikat', 'Status'];
    const rows = studentList.map((st) => {
      const avg = calculateStudentAvg(st.id);
      const pred = getPredikat(avg);
      return [st.id, st.name, avg, pred.label, 'LULUS'].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Rapor & Rekapitulasi Nilai
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Matriks penilaian tugas, ujian capstone, dan evaluasi hasil belajar
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rapor</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter Mata Pelajaran:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <span>Total Siswa: {studentList.length}</span>
          <span>•</span>
          <span>Total Tugas: {filteredTasks.length}</span>
        </div>
      </div>

      {/* Grade Matrix Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Siswa / Peserta</th>
                {filteredTasks.slice(0, 3).map((t) => (
                  <th key={t.id} className="py-3.5 px-4 text-center max-w-[140px] truncate" title={t.title}>
                    {t.title}
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center">Rata-rata</th>
                <th className="py-3.5 px-4 text-center">Predikat</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
              {studentList.map((st) => {
                const avg = calculateStudentAvg(st.id);
                const predikat = getPredikat(avg);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{st.email}</div>
                        </div>
                      </div>
                    </td>

                    {filteredTasks.slice(0, 3).map((t) => {
                      const sub = submissions.find(
                        (s) => s.taskId === t.id && s.studentId === st.id
                      );
                      return (
                        <td key={t.id} className="py-3.5 px-4 text-center">
                          {sub?.score !== undefined ? (
                            <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              {sub.score}
                            </span>
                          ) : sub ? (
                            <span className="text-[10px] text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                              Terkumpul
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3.5 px-4 text-center font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                      {avg}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${predikat.color}`}
                      >
                        {predikat.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Kompeten</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
