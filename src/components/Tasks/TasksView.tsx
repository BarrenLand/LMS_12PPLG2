import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Task, TaskSubmission } from '../../types';
import {
  FileCheck,
  Plus,
  Trash2,
  Clock,
  ExternalLink,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Link2,
  Award,
  Edit3,
  X,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    currentUser,
    classes,
    tasks,
    submissions,
    users,
    addTask,
    deleteTask,
    submitTask,
    gradeSubmission,
  } = useLms();

  const isTeacher =
    currentUser.role === 'guru' ||
    currentUser.role === 'teacher' ||
    currentUser.role === 'admin' ||
    currentUser.role === 'wali_kelas';

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [taskClassId, setTaskClassId] = useState(classes[0]?.id || '');
  const [taskMaxScore, setTaskMaxScore] = useState(100);
  const [taskDueDate, setTaskDueDate] = useState('2026-09-01T23:59');

  // Submission modal state (Student)
  const [submittingTask, setSubmittingTask] = useState<Task | null>(null);
  const [gdriveInput, setGdriveInput] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [urlError, setUrlError] = useState('');

  // Grading modal state (Teacher)
  const [gradingSub, setGradingSub] = useState<TaskSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesClass = selectedClassFilter === 'all' || t.classId === selectedClassFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskClassId) return;

    addTask({
      title: taskTitle,
      instructions: taskInstructions,
      classId: taskClassId,
      teacherId: currentUser.id,
      maxScore: taskMaxScore,
      dueDate: taskDueDate,
    });

    setTaskTitle('');
    setTaskInstructions('');
    setShowCreateModal(false);
  };

  const handleOpenSubmitModal = (task: Task) => {
    const existing = submissions.find(
      (s) => s.taskId === task.id && s.studentId === currentUser.id
    );
    setGdriveInput(existing?.gdriveUrl || '');
    setSubmissionNote(existing?.note || '');
    setUrlError('');
    setSubmittingTask(task);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;

    if (!gdriveInput.trim()) {
      setUrlError('URL Google Drive atau link repository wajib diisi');
      return;
    }
    if (!gdriveInput.startsWith('http://') && !gdriveInput.startsWith('https://')) {
      setUrlError('Harap sertakan link valid dengan awalan https://');
      return;
    }

    submitTask(submittingTask.id, gdriveInput, submissionNote);
    setSubmittingTask(null);
  };

  const handleOpenGradeModal = (sub: TaskSubmission) => {
    setGradingSub(sub);
    setScoreInput(sub.score || 90);
    setFeedbackInput(sub.feedback || 'Kerja bagus, penjelasan terstruktur rapi.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    gradeSubmission(gradingSub.id, scoreInput, feedbackInput);
    setGradingSub(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tugas & Penilaian
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengumpulan tugas via Google Drive dan penilaian guru secara langsung
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tugas Baru</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-400 self-end sm:self-auto">
          Ditemukan {filteredTasks.length} tugas
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const classObj = classes.find((c) => c.id === task.classId);
          const taskSubs = submissions.filter((s) => s.taskId === task.id);
          const mySub = submissions.find(
            (s) => s.taskId === task.id && s.studentId === currentUser.id
          );

          return (
            <div
              key={task.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60">
                      {classObj?.name || 'Mata Pelajaran'}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Tenggat: {new Date(task.dueDate).toLocaleString('id-ID')}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Max Score: {task.maxScore} Poin
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.instructions}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isTeacher ? (
                    <button
                      onClick={() => handleOpenSubmitModal(task)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        mySub
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{mySub ? 'Edit Submission' : 'Kumpul Tugas'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Submissions Section (For Teachers) */}
              {isTeacher && taskSubs.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Pengumpulan Siswa ({taskSubs.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {taskSubs.map((sub) => {
                      const student = users.find((u) => u.id === sub.studentId);
                      return (
                        <div
                          key={sub.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={student?.avatar}
                              alt={student?.name}
                              className="w-7 h-7 rounded-full object-cover border"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                {student?.name}
                              </div>
                              <a
                                href={sub.gdriveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 truncate"
                              >
                                <Link2 className="w-3 h-3 shrink-0" />
                                <span className="truncate">{sub.gdriveUrl}</span>
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {sub.score !== undefined ? (
                              <span className="font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-xs">
                                {sub.score} / {task.maxScore}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                                Belum Dinilai
                              </span>
                            )}
                            <button
                              onClick={() => handleOpenGradeModal(sub)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] hover:bg-indigo-100"
                            >
                              Nilai
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Buat Tugas & Lembar Kerja Baru
              </h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mata Pelajaran / Kelas <span className="text-rose-500">*</span>
                </label>
                <select
                  value={taskClassId}
                  onChange={(e) => setTaskClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  required
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Tugas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Contoh: Implementasi REST API Golang & Docker"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instruksi & Kriteria Penilaian
                </label>
                <textarea
                  value={taskInstructions}
                  onChange={(e) => setTaskInstructions(e.target.value)}
                  placeholder="Jelaskan spesifikasi tugas, format submission (Google Drive/GitHub), dan deadline..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skor Maksimal
                  </label>
                  <input
                    type="number"
                    value={taskMaxScore}
                    onChange={(e) => setTaskMaxScore(Number(e.target.value))}
                    min={10}
                    max={100}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tenggat Waktu
                  </label>
                  <input
                    type="datetime-local"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal (Teacher) */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Penilaian Tugas Siswa
              </h3>
              <button onClick={() => setGradingSub(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
                <div className="text-slate-400 text-[10px]">Tautan Pekerjaan Siswa:</div>
                <a
                  href={gradingSub.gdriveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{gradingSub.gdriveUrl}</span>
                </a>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nilai Angka (0 - 100) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Umpan Balik / Catatan untuk Siswa
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  rows={3}
                  placeholder="Beri motivasi dan catatan perbaikan..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan & Terbitkan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
