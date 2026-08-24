import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Class } from '../../types';
import {
  BookOpen,
  Users,
  FileText,
  FileCheck,
  UserCheck,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
  X,
  ExternalLink,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const {
    currentUser,
    classes,
    materials,
    tasks,
    users,
    selectedClassId,
    setSelectedClassId,
    setActiveTab,
  } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [inspectClass, setInspectClass] = useState<Class | null>(
    classes.find((c) => c.id === selectedClassId) || null
  );

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetail = (cls: Class) => {
    setSelectedClassId(cls.id);
    setInspectClass(cls);
  };

  const getTeacher = (teacherId: string) => {
    return users.find((u) => u.id === teacherId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mata Pelajaran & Kelas
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daftar seluruh kurikulum, silabus, dan kelas terdaftar di platform
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata pelajaran..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls, idx) => {
          const teacher = getTeacher(cls.teacherId);
          const classMats = materials.filter((m) => m.classId === cls.id);
          const classTasks = tasks.filter((t) => t.classId === cls.id);

          const gradients = [
            'from-indigo-600 to-blue-700',
            'from-emerald-600 to-teal-700',
            'from-purple-600 to-indigo-700',
            'from-amber-600 to-orange-700',
            'from-rose-600 to-pink-700',
          ];
          const bgGradient = gradients[idx % gradients.length];

          return (
            <div
              key={cls.id}
              className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Card Banner */}
              <div className={`p-5 bg-gradient-to-r ${bgGradient} text-white space-y-3 relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-xs uppercase tracking-wider">
                    {cls.code}
                  </span>
                  <span className="text-[11px] font-semibold text-white/90 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{cls.studentIds?.length || 0} Siswa</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-white line-clamp-1 drop-shadow-xs">
                  {cls.name}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {cls.description}
                </p>

                {/* Teacher Info */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <img
                    src={teacher?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={teacher?.name || 'Guru'}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Pengampu / Dosen</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {teacher?.name || 'Belum Ditugaskan'}
                    </div>
                  </div>
                </div>

                {/* Resource Counters & Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      {classMats.length} Modul
                    </span>
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {classTasks.length} Tugas
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(cls)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition text-center"
                    >
                      Detail Silabus
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClassId(cls.id);
                        setActiveTab('materials');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition text-center"
                    >
                      Buka Kelas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Detail Modal / Drawer */}
      {inspectClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono">
                  {inspectClass.code}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                  {inspectClass.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectClass(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Deskripsi & Kompetensi Dasar
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {inspectClass.description}
                </p>
              </div>

              {/* Materials in this class */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>Modul & Materi Pembelajaran</span>
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedClassId(inspectClass.id);
                      setActiveTab('materials');
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Buka Semua
                  </button>
                </div>
                <div className="space-y-2">
                  {materials.filter((m) => m.classId === inspectClass.id).map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          {m.type}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</span>
                      </div>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Unduh</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks in this class */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    <span>Tugas & Evaluasi</span>
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedClassId(inspectClass.id);
                      setActiveTab('tasks');
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Buka Tugas
                  </button>
                </div>
                <div className="space-y-2">
                  {tasks.filter((t) => t.classId === inspectClass.id).map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{t.title}</div>
                        <div className="text-[10px] text-slate-400">Max Score: {t.maxScore} Poin</div>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                        {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectClass(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setSelectedClassId(inspectClass.id);
                  setActiveTab('materials');
                  setInspectClass(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                Akses Ruang Kelas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
