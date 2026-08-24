import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Task, TaskSubmission, AttendanceSession } from '../../types';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FileCheck,
  FileText,
  UserCheck,
  ArrowRight,
  ExternalLink,
  Upload,
  Sparkles,
  Link2,
  TrendingUp,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    tasks,
    submissions,
    materials,
    attendanceSessions,
    attendanceRecords,
    studentSelfCheckIn,
    submitTask,
    setActiveTab,
    setSelectedClassId,
  } = useLms();

  // Submission modal state
  const [activeTaskModal, setActiveTaskModal] = useState<Task | null>(null);
  const [gdriveInput, setGdriveInput] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [urlError, setUrlError] = useState('');
  const [checkInSuccessMessage, setCheckInSuccessMessage] = useState<string | null>(null);

  // Student's enrolled classes
  const myClasses = classes.filter((c) =>
    c.studentIds ? c.studentIds.includes(currentUser.id) : true
  );
  const myClassIds = myClasses.map((c) => c.id);

  // Student's tasks
  const myTasks = tasks.filter((t) => myClassIds.includes(t.classId));

  // Student's submissions
  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  // Check active attendance session for my classes
  const openSessions = attendanceSessions.filter(
    (s) => s.isOpen && myClassIds.includes(s.classId)
  );

  // Check if already checked in to open session
  const getSessionCheckInStatus = (sessionId: string) => {
    return attendanceRecords.find(
      (r) => r.sessionId === sessionId && r.studentId === currentUser.id
    );
  };

  // Self check-in handler
  const handleSelfCheckIn = (sessionId: string) => {
    const res = studentSelfCheckIn(sessionId, currentUser.id);
    setCheckInSuccessMessage(res.message);
    setTimeout(() => setCheckInSuccessMessage(null), 4000);
  };

  // Task submission handler
  const handleOpenSubmission = (task: Task) => {
    const existing = mySubmissions.find((s) => s.taskId === task.id);
    setGdriveInput(existing?.gdriveUrl || '');
    setSubmissionNote(existing?.note || '');
    setUrlError('');
    setActiveTaskModal(task);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskModal) return;

    if (!gdriveInput.trim()) {
      setUrlError('URL Google Drive atau link dokumen wajib diisi');
      return;
    }
    if (!gdriveInput.startsWith('http://') && !gdriveInput.startsWith('https://')) {
      setUrlError('Harap sertakan link valid dengan awalan https://');
      return;
    }

    submitTask(activeTaskModal.id, gdriveInput, submissionNote);
    setActiveTaskModal(null);
  };

  // Stats calculation
  const completedTaskCount = myTasks.filter((t) =>
    mySubmissions.some((s) => s.taskId === t.id)
  ).length;

  const gradedSubmissions = mySubmissions.filter((s) => s.score !== undefined);
  const averageGrade =
    gradedSubmissions.length > 0
      ? (
          gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) /
          gradedSubmissions.length
        ).toFixed(1)
      : '92.0';

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* 1. Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20 border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Semester Ganjil 2025/2026 • Pekan 8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Semangat Belajar, {currentUser.name}! 🚀
            </h1>
            <p className="text-sm text-indigo-200/90 max-w-xl leading-relaxed">
              Kamu memiliki <span className="font-bold text-white">{myTasks.length - completedTaskCount} tugas</span> yang perlu diselesaikan dan <span className="font-bold text-white">{myClasses.length} kelas aktif</span> semester ini.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">{averageGrade}</div>
              <div className="text-[11px] font-medium text-indigo-200">Rata-rata Nilai</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                {completedTaskCount}/{myTasks.length}
              </div>
              <div className="text-[11px] font-medium text-indigo-200">Tugas Terkumpul</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">96%</div>
              <div className="text-[11px] font-medium text-indigo-200">Presensi Hadir</div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in success toast */}
      {checkInSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold">{checkInSuccessMessage}</span>
          </div>
          <button onClick={() => setCheckInSuccessMessage(null)} className="text-xs font-bold underline">
            Tutup
          </button>
        </div>
      )}

      {/* 2. Active Attendance Session Alert (If Any) */}
      {openSessions.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/20 border border-emerald-400/30">
          {openSessions.map((session) => {
            const classObj = classes.find((c) => c.id === session.classId);
            const myRecord = getSessionCheckInStatus(session.id);
            const isAlreadyCheckedIn = !!myRecord;

            return (
              <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shrink-0">
                    <UserCheck className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-100 bg-white/10 px-2 py-0.5 rounded-full mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      Presensi Mandiri Sedang Dibuka
                    </div>
                    <h3 className="font-bold text-base text-white">
                      {session.title} - {classObj?.name}
                    </h3>
                    <p className="text-xs text-emerald-100/90">
                      Waktu sesi: {session.startTime} - {session.endTime} WIB • Pastikan lakukan check-in sebelum sesi ditutup.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {isAlreadyCheckedIn ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Kamu Sudah Hadir (Checked In)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelfCheckIn(session.id)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Presensi Sekarang (1-Tap)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Classes & Urgent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Enrolled Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Mata Pelajaran & Kelas Saya
                  </h2>
                  <p className="text-xs text-slate-400">{myClasses.length} kelas aktif yang kamu ikuti</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('classes')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myClasses.map((cls, idx) => {
                const classMatCount = materials.filter((m) => m.classId === cls.id).length;
                const classTaskCount = tasks.filter((t) => t.classId === cls.id).length;
                const colors = [
                  'from-indigo-500 to-blue-600',
                  'from-emerald-500 to-teal-600',
                  'from-purple-500 to-indigo-600',
                  'from-amber-500 to-orange-600',
                ];
                const gradient = colors[idx % colors.length];

                return (
                  <div
                    key={cls.id}
                    className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col group"
                  >
                    {/* Color Banner */}
                    <div className={`h-20 bg-gradient-to-r ${gradient} p-4 text-white flex flex-col justify-between relative`}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs w-fit">
                        {cls.code}
                      </span>
                      <h3 className="font-bold text-sm text-white truncate drop-shadow-xs">
                        {cls.name}
                      </h3>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {cls.description}
                      </p>

                      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {/* Progress / Resource counters */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            {classMatCount} Modul Materi
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                            {classTaskCount} Tugas
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedClassId(cls.id);
                              setActiveTab('materials');
                            }}
                            className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold text-slate-700 dark:text-slate-300 transition text-center"
                          >
                            Buka Materi
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClassId(cls.id);
                              setActiveTab('tasks');
                            }}
                            className="flex-1 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition text-center"
                          >
                            Tugas Kelas
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Priority Tasks & Google Drive Submissions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Tugas & Tenggat Waktu
                  </h2>
                  <p className="text-xs text-slate-400">Kumpulkan tugas via link Google Drive atau repository</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Tugas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {myTasks.slice(0, 4).map((task) => {
                const classObj = classes.find((c) => c.id === task.classId);
                const sub = mySubmissions.find((s) => s.taskId === task.id);
                const isSubmitted = !!sub;
                const isGraded = sub?.score !== undefined;

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {classObj?.name || 'Mata Pelajaran'}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Tenggat: {new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Max: {task.maxScore} Poin
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.instructions}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isGraded ? (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center">
                          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            Nilai: {sub.score} / {task.maxScore}
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Sudah Dinilai</div>
                        </div>
                      ) : isSubmitted ? (
                        <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-center">
                          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                            Terkumpul ✓
                          </div>
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400">Menunggu Review</div>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-center">
                          <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                            Belum Kumpul
                          </div>
                          <div className="text-[10px] text-amber-600 dark:text-amber-400">Segera Kirim</div>
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenSubmission(task)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSubmitted
                            ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isSubmitted ? 'Edit Link' : 'Kumpul'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Schedule, Attendance Matrix & Recent Feedback */}
        <div className="space-y-6">
          {/* Today's Schedule Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Jadwal Hari Ini
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-indigo-500 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                  <span>Pemrograman Web & Go</span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400">08:00 - 10:30</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Lab Komputer 3 • Pak Daniel Nurindra
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-emerald-500 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                  <span>Basis Data MongoDB</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">11:00 - 13:00</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ruang 204 • Bu Siti Rahmawati
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('schedule')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition text-center"
            >
              Lihat Jadwal Mingguan Penuh
            </button>
          </div>

          {/* Recent Grades & Teacher Feedback */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Nilai & Catatan Guru
                </h3>
                <p className="text-[11px] text-slate-400">Umpan balik penilaian terbaru</p>
              </div>
            </div>

            <div className="space-y-3">
              {gradedSubmissions.length > 0 ? (
                gradedSubmissions.slice(0, 3).map((sub) => {
                  const task = tasks.find((t) => t.id === sub.taskId);
                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate max-w-[150px]">
                          {task?.title || 'Tugas'}
                        </span>
                        <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          {sub.score} / 100
                        </span>
                      </div>
                      {sub.feedback ? (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          "{sub.feedback}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">Kerja bagus, struktur kode rapi.</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Belum ada nilai yang diterbitkan untuk akun ini.
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('gradebook')}
              className="w-full py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition text-center"
            >
              Buka Rekap Rapor Lengkap
            </button>
          </div>
        </div>
      </div>

      {/* 4. Google Drive Task Submission Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Pengumpulan Tugas Siswa
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {classes.find((c) => c.id === activeTaskModal.classId)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTaskModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200">
                  {activeTaskModal.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeTaskModal.instructions}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>Maksimum Nilai: {activeTaskModal.maxScore} Poin</span>
                  <span>•</span>
                  <span>Tenggat: {new Date(activeTaskModal.dueDate).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Link Google Drive / Repository Tugas <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={gdriveInput}
                    onChange={(e) => {
                      setGdriveInput(e.target.value);
                      setUrlError('');
                    }}
                    placeholder="https://drive.google.com/file/d/... atau https://github.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                {urlError && <p className="text-rose-500 text-[11px] mt-1">{urlError}</p>}
                <p className="text-[11px] text-slate-400 mt-1">
                  Pastikan akses share Google Drive disetel ke "Siapa saja dengan link dapat melihat".
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Catatan untuk Guru (Opsional)
                </label>
                <textarea
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="Tuliskan catatan tambahan jika ada fitur yang perlu dicoba khusus..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition"
                >
                  Kirimkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
