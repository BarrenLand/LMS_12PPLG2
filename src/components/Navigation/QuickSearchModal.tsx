import React, { useState, useEffect } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Search,
  BookOpen,
  FileCheck,
  FileText,
  Users,
  MessageSquare,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const { classes, tasks, materials, users, forumPosts, setActiveTab, setSelectedClassId } = useLms();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredClasses = q
    ? classes.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    : classes.slice(0, 3);

  const filteredTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.instructions.toLowerCase().includes(q))
    : tasks.slice(0, 3);

  const filteredMaterials = q
    ? materials.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
    : materials.slice(0, 3);

  const filteredStudents = q
    ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    : [];

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab('classes');
    onClose();
  };

  const handleSelectTask = () => {
    setActiveTab('tasks');
    onClose();
  };

  const handleSelectMaterial = () => {
    setActiveTab('materials');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari mata pelajaran, tugas, modul materi, atau siswa... (ESC untuk tutup)"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 text-xs">
          {/* Quick Filter Navigation */}
          {!q && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pencarian Cepat & Rekomendasi</span>
            </div>
          )}

          {/* Classes Result */}
          {filteredClasses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mata Pelajaran & Kelas ({filteredClasses.length})</span>
              </div>
              <div className="space-y-1">
                {filteredClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {cls.code.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {cls.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{cls.code} • {cls.studentIds.length} Siswa</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Result */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tugas & Penilaian ({filteredTasks.length})</span>
              </div>
              <div className="space-y-1">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={handleSelectTask}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{t.instructions}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                      Max {t.maxScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials Result */}
          {filteredMaterials.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Modul & Materi ({filteredMaterials.length})</span>
              </div>
              <div className="space-y-1">
                {filteredMaterials.map((m) => (
                  <button
                    key={m.id}
                    onClick={handleSelectMaterial}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/70 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center uppercase text-[10px] font-bold">
                        {m.type}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{m.description}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users Result (if query matching) */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-2 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-500" />
                <span>Pengguna / Siswa ({filteredStudents.length})</span>
              </div>
              <div className="space-y-1">
                {filteredStudents.map((u) => (
                  <div
                    key={u.id}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && filteredClasses.length === 0 && filteredTasks.length === 0 && filteredMaterials.length === 0 && filteredStudents.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium">Tidak ada hasil ditemukan untuk "{query}"</p>
              <p className="text-[11px] mt-1">Coba gunakan kata kunci nama mapel, nomor tugas, atau nama siswa.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Tekan <kbd className="font-semibold text-slate-600 dark:text-slate-300">↵</kbd> untuk memilih</span>
            <span><kbd className="font-semibold text-slate-600 dark:text-slate-300">ESC</kbd> untuk keluar</span>
          </div>
          <span className="font-medium text-indigo-600 dark:text-indigo-400">Apex Quick Search</span>
        </div>
      </div>
    </div>
  );
};
