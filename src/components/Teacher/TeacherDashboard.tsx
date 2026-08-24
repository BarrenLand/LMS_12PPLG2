import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Task, StudyMaterial, TaskSubmission, AttendanceStatus } from '../../types';
import { TeacherAttendance } from '../Attendance/TeacherAttendance';
import {
  FileText,
  Upload,
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  MessageSquare,
  Sparkles,
  Link2,
  FileCheck,
  Search,
  Filter,
  UserCheck,
  Layers,
  Users,
  ShieldAlert,
  Edit3,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    materials,
    tasks,
    submissions,
    users,
    attendanceSessions,
    attendanceRecords,
    addTask,
    deleteTask,
    addMaterial,
    deleteMaterial,
    gradeSubmission,
    setActiveTab,
  } = useLms();

  // Teacher classes
  const myClasses = classes.filter(
    (c) => c.teacherId === currentUser.id || currentUser.role === 'admin'
  );

  const [selectedClassId, setSelectedClassId] = useState<string>(
    myClasses[0]?.id || classes[0]?.id || ''
  );

  const activeClass = classes.find((c) => c.id === selectedClassId) || myClasses[0] || classes[0];

  // Active view section: 'overview' | 'sessions' | 'recap' | 'tasks' | 'materials'
  const [activeSection, setActiveSection] = useState<
    'overview' | 'sessions' | 'recap' | 'tasks' | 'materials'
  >('overview');

  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [taskMaxScore, setTaskMaxScore] = useState(100);
  const [taskDueDate, setTaskDueDate] = useState('2026-08-30T23:59');

  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matType, setMatType] = useState<'pdf' | 'video' | 'link' | 'doc'>('pdf');
  const [matUrl, setMatUrl] = useState('');

  // Grading Modal State
  const [gradingSub, setGradingSub] = useState<TaskSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  // Filter tasks & materials by selected class
  const classTasks = tasks.filter((t) => t.classId === selectedClassId);
  const classMaterials = materials.filter((m) => m.classId === selectedClassId);

  // Submissions for tasks in selected class
  const classTaskIds = classTasks.map((t) => t.id);
  const classSubmissions = submissions.filter((s) => classTaskIds.includes(s.taskId));
  const ungradedSubmissions = classSubmissions.filter((s) => s.score === undefined);

  // Filter active attendance for teacher's class
  const todaySessions = attendanceSessions.filter(
    (s) => s.classId === selectedClassId || myClasses.some((c) => c.id === s.classId)
  );
  const latestSession = todaySessions[0];

  // Stats calculation
  const totalStudentsMonitored = myClasses.reduce(
    (acc, c) => acc + (c.studentIds ? c.studentIds.length : 0),
    0
  );
  const pendingActionCount = ungradedSubmissions.length + (latestSession?.isOpen ? 1 : 0);

  // Attendance stats for donut chart
  const classAttendanceRecords = attendanceRecords.filter((r) =>
    todaySessions.some((s) => s.id === r.sessionId)
  );
  const countHadir = classAttendanceRecords.filter((r) => r.status === 'hadir').length;
  const countIzin = classAttendanceRecords.filter((r) => r.status === 'izin').length;
  const countSakit = classAttendanceRecords.filter((r) => r.status === 'sakit').length;
  const countAlfa = classAttendanceRecords.filter((r) => r.status === 'alfa').length;
  const totalAttendance = classAttendanceRecords.length;
  const attendancePercentage =
    totalAttendance > 0 ? Math.round((countHadir / totalAttendance) * 100) : 0;

  // Donut chart SVG math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendancePercentage / 100) * circumference;

  // Handle Save Task
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedClassId) return;

    addTask({
      title: taskTitle,
      instructions: taskInstructions,
      classId: selectedClassId,
      teacherId: currentUser.id,
      maxScore: Number(taskMaxScore),
      dueDate: new Date(taskDueDate).toISOString(),
    });

    setTaskTitle('');
    setTaskInstructions('');
    setShowTaskModal(false);
  };

  // Handle Save Material
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matUrl.trim() || !selectedClassId) return;

    addMaterial({
      title: matTitle,
      description: matDesc,
      classId: selectedClassId,
      authorId: currentUser.id,
      type: matType,
      url: matUrl,
    });

    setMatTitle('');
    setMatDesc('');
    setMatUrl('');
    setShowMaterialModal(false);
  };

  // Open Grading Modal
  const handleOpenGrading = (sub: TaskSubmission) => {
    setGradingSub(sub);
    setScoreInput(sub.score ?? 90);
    setFeedbackInput(sub.feedback || 'Great effort! Good solution structure.');
  };

  // Submit Grade
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    gradeSubmission(gradingSub.id, Number(scoreInput), feedbackInput);
    setGradingSub(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION SELECTOR TABS IF VIEWING SUB-MODULES */}
      {activeSection !== 'overview' && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#10231f] border border-emerald-100 dark:border-[#1a3b34]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('overview')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[#152e28] transition"
            >
              ← Kembali ke Dashboard Utama
            </button>
            <span className="text-xs font-bold text-slate-400">/</span>
            <span className="text-xs font-extrabold text-[#064e3b] dark:text-white uppercase">
              {activeSection === 'sessions'
                ? 'Sesi & Presensi Mapel'
                : activeSection === 'recap'
                ? 'Rekap Kehadiran'
                : activeSection === 'tasks'
                ? 'Tugas & Penilaian'
                : 'Materi Pembelajaran'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('tasks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeSection === 'tasks'
                  ? 'bg-[#10b981] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-[#152e28]'
              }`}
            >
              Tugas ({classTasks.length})
            </button>
            <button
              onClick={() => setActiveSection('materials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeSection === 'materials'
                  ? 'bg-[#10b981] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-[#152e28]'
              }`}
            >
              Materi ({classMaterials.length})
            </button>
            <button
              onClick={() => setActiveSection('sessions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeSection === 'sessions'
                  ? 'bg-[#10b981] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-[#152e28]'
              }`}
            >
              Presensi
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP HERO BANNER & 2. KEHADIRAN HARI INI CARD          */}
      {/* ======================================================== */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Welcome Hero Banner */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#f0fbf5] via-[#f7fcf8] to-[#edf9f3] dark:from-[#10231f] dark:via-[#122622] dark:to-[#0f201c] border border-[#d1fae5] dark:border-[#1a3b34] shadow-sm">
            <div>
              {/* HALAMAN GURU Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-[#152d27] text-[#059669] dark:text-[#34d399] text-[11px] font-extrabold tracking-wider border border-[#bbf7d0] dark:border-[#1e463d] mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span>HALAMAN GURU</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                Halo, {currentUser.name}!
              </h2>

              {/* Subtitle */}
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Satu pusat kendali untuk memantau kelas, menjalankan sesi mapel, dan menindaklanjuti
                kebutuhan siswa sesuai peran akunmu.
              </p>

              {/* Meta Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-[#132c25] border border-emerald-100 dark:border-[#1e463d] text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  <BookOpen className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Guru mapel</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-[#132c25] border border-emerald-100 dark:border-[#1e463d] text-xs font-semibold text-slate-700 dark:text-emerald-200">
                  <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Tahun ajaran aktif</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Sesi Mapel & Rekap Mapel */}
            <div className="mt-6 pt-5 border-t border-emerald-200/50 dark:border-[#1a3b34] flex flex-wrap items-center gap-3">
              <button
                id="hero-btn-sesi-mapel"
                onClick={() => setActiveSection('sessions')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#132c25] border border-emerald-200 dark:border-[#1e463d] text-xs font-bold text-slate-800 dark:text-white hover:bg-emerald-50 dark:hover:bg-[#193a32] transition shadow-sm"
              >
                <Clock className="w-4 h-4 text-[#10b981]" />
                <span>Sesi Mapel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-emerald-400" />
              </button>

              <button
                id="hero-btn-rekap-mapel"
                onClick={() => setActiveSection('recap')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#132c25] border border-emerald-200 dark:border-[#1e463d] text-xs font-bold text-slate-800 dark:text-white hover:bg-emerald-50 dark:hover:bg-[#193a32] transition shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-[#10b981]" />
                <span>Rekap Mapel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Kehadiran Hari Ini (Donut Chart) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#10231f] border border-emerald-100 dark:border-[#1a3b34] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Kehadiran Hari Ini
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Snapshot kelas dan kehadiran hari ini
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-[#152e28] text-emerald-700 dark:text-[#34d399] text-[11px] font-bold border border-emerald-200 dark:border-[#1e463d]">
                  Hari ini
                </span>
              </div>

              {/* Donut Chart Visual */}
              <div className="relative my-5 flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 140 140">
                  {/* Track Background */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-[#183a32]"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Centered Percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {attendancePercentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400">
                    Kehadiran
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Status Legend dots matching screenshot */}
            <div className="flex items-center justify-around pt-3 border-t border-slate-100 dark:border-[#16332d] text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span>Hadir</span>
                <span className="font-bold text-slate-900 dark:text-white">{countHadir}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span>Izin</span>
                <span className="font-bold text-slate-900 dark:text-white">{countIzin}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                <span>Sakit</span>
                <span className="font-bold text-slate-900 dark:text-white">{countSakit}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span>Alfa</span>
                <span className="font-bold text-slate-900 dark:text-white">{countAlfa}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ROW OF 4 STAT METRIC CARDS                            */}
      {/* ======================================================== */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: PERAN AKTIF */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10231f] border border-emerald-100/80 dark:border-[#1a3b34] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-[#1e1e38] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                PERAN AKTIF
              </p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                1
              </h4>
            </div>
          </div>

          {/* Card 2: SISWA TERPANTAU */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10231f] border border-emerald-100/80 dark:border-[#1a3b34] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-[#2b2416] text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/40">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                SISWA TERPANTAU
              </p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalStudentsMonitored}
              </h4>
            </div>
          </div>

          {/* Card 3: PERLU TINDAK LANJUT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10231f] border border-emerald-100/80 dark:border-[#1a3b34] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-[#331c1e] text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                PERLU TINDAK LANJUT
              </p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {pendingActionCount}
              </h4>
            </div>
          </div>

          {/* Card 4: MENUNGGU TINJAUAN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10231f] border border-emerald-100/80 dark:border-[#1a3b34] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-[#152a33] text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-100 dark:border-cyan-900/40">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                MENUNGGU TINJAUAN
              </p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {ungradedSubmissions.length}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SESI MAPEL SAAT INI & 5. MATA PELAJARAN SAYA          */}
      {/* ======================================================== */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sesi Mapel Saat Ini */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#10231f] border border-emerald-100 dark:border-[#1a3b34] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Sesi Mapel Saat Ini
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-[#15332a] text-emerald-800 dark:text-[#34d399] text-[11px] font-bold border border-emerald-200 dark:border-[#1e463d]">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Akses daftar hadir saat jam pelajaran sedang berjalan
              </p>

              {/* Inner Active Lesson Card matching the screenshot */}
              <div className="mt-4 p-4 rounded-2xl bg-[#f8fdfb] dark:bg-[#122924] border border-[#d1fae5] dark:border-[#1e463d]">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeClass?.name || 'Pemrograman Web'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-emerald-300 mt-0.5 font-medium">
                      {activeClass?.code || 'XII PPLG 2'} · Senin, 10:15–12:00
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#15312b] text-[#10b981] border border-emerald-100 dark:border-[#1f4b40]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-normal">
                  {activeClass?.description || 'Melanjutkan LMS dan Proyek Figma'}
                </p>

                <div className="mt-4">
                  <button
                    id="btn-buka-daftar-hadir"
                    onClick={() => setActiveSection('sessions')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Buka daftar hadir</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#16332d] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Siswa Terdaftar: {activeClass?.studentIds?.length || 3} Siswa</span>
              <button
                onClick={() => setActiveSection('sessions')}
                className="text-xs font-bold text-[#059669] dark:text-[#34d399] hover:underline"
              >
                Kelola Semua Sesi →
              </button>
            </div>
          </div>

          {/* Mata Pelajaran Saya */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#10231f] border border-emerald-100 dark:border-[#1a3b34] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Mata Pelajaran Saya
                </h3>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-[#15332a] text-[#10b981]">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kelas dan jadwal mengajar yang aktif
              </p>

              {/* Subject list matching screenshot */}
              <div className="mt-4 space-y-2.5">
                {myClasses.length > 0 ? (
                  myClasses.map((cls, idx) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClassId(cls.id);
                        setActiveSection('tasks');
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition border text-left ${
                        selectedClassId === cls.id
                          ? 'bg-emerald-50/70 dark:bg-[#143029] border-emerald-300 dark:border-[#215145]'
                          : 'bg-slate-50/60 dark:bg-[#122823] border-slate-100 dark:border-[#1a3d36] hover:bg-emerald-50/40'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {cls.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {cls.code} · {idx === 0 ? '22 jadwal' : '3 jadwal'}
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-[#183932] border border-slate-200 dark:border-[#1e463d] flex items-center justify-center text-slate-400 dark:text-emerald-300">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4">Belum ada mata pelajaran terdaftar.</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#16332d] flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Total {myClasses.length} Kelas Mengajar
              </span>
              <button
                onClick={() => setActiveSection('materials')}
                className="text-xs font-bold text-[#059669] dark:text-[#34d399] hover:underline"
              >
                Lihat Materi & Silabus →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ATTENDANCE SESSIONS & RECAP VIEW                      */}
      {/* ======================================================== */}
      {(activeSection === 'sessions' || activeSection === 'recap') && (
        <div className="bg-white dark:bg-[#10231f] rounded-3xl p-6 border border-emerald-100 dark:border-[#1a3b34] shadow-sm">
          <TeacherAttendance />
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. TASKS & GRADING MANAGEMENT VIEW                       */}
      {/* ======================================================== */}
      {activeSection === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#10231f] p-5 rounded-3xl border border-emerald-100 dark:border-[#1a3b34]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tugas & Penilaian: {activeClass?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Buat instruksi tugas dan periksa tautan Google Drive kiriman siswa
              </p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Buat Tugas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classTasks.map((task) => {
              const taskSubs = submissions.filter((s) => s.taskId === task.id);
              const gradedCount = taskSubs.filter((s) => s.score !== undefined).length;

              return (
                <div
                  key={task.id}
                  className="bg-white dark:bg-[#10231f] rounded-3xl border border-emerald-100 dark:border-[#1a3b34] p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-[#34d399] bg-emerald-50 dark:bg-[#15312b] px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-[#1e463d]">
                        Skor Maks: {task.maxScore} Poin
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                        {task.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Hapus tugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-[#f8faf9] dark:bg-[#122924] p-3.5 rounded-2xl border border-slate-100 dark:border-[#1a3d36]">
                    {task.instructions}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#16332d] flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                      Batas: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-[#064e3b] dark:text-[#34d399]">
                      {taskSubs.length} Kiriman ({gradedCount} Dinilai)
                    </span>
                  </div>

                  {/* Submission list for this task */}
                  {taskSubs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase">
                        Kiriman Siswa (Google Drive):
                      </p>
                      {taskSubs.map((sub) => {
                        const student = users.find((u) => u.id === sub.studentId);
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-100 dark:border-[#1e463d] text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={student?.avatar}
                                alt={student?.name}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                              <span className="font-bold text-slate-800 dark:text-white truncate">
                                {student?.name || 'Siswa'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={sub.gdriveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
                              >
                                <span>GDrive</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => handleOpenGrading(sub)}
                                className="px-2.5 py-1 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold transition"
                              >
                                {sub.score !== undefined ? `Nilai: ${sub.score}` : 'Beri Nilai'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. STUDY MATERIALS VIEW                                  */}
      {/* ======================================================== */}
      {activeSection === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#10231f] p-5 rounded-3xl border border-emerald-100 dark:border-[#1a3b34]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Materi & Silabus Pembelajaran
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unggah modul PDF, video pembelajaran, dan tautan referensi siswa
              </p>
            </div>
            <button
              onClick={() => setShowMaterialModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold shadow-sm transition"
            >
              <Upload className="w-4 h-4" /> Tambah Materi Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white dark:bg-[#10231f] rounded-3xl border border-emerald-100 dark:border-[#1a3b34] p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-[#15312b] text-emerald-800 dark:text-[#34d399] text-[10px] font-bold uppercase border border-emerald-200 dark:border-[#1e463d]">
                      {mat.type}
                    </span>
                    <button
                      onClick={() => deleteMaterial(mat.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed line-clamp-3">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#16332d]">
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#f0fbf5] dark:bg-[#143029] text-[#059669] dark:text-[#34d399] text-xs font-bold hover:bg-emerald-100 transition"
                  >
                    <span>Buka Materi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#10231f] rounded-3xl max-w-lg w-full p-6 border border-emerald-100 dark:border-[#1a3b34] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Buat Tugas Baru untuk {activeClass?.name}
            </h3>
            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">Judul Tugas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tugas 1 - Proyek Desain Antarmuka LMS"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Instruksi Penugasan
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan petunjuk pengerjaan dan mintalah siswa menyertakan link folder Google Drive..."
                  value={taskInstructions}
                  onChange={(e) => setTaskInstructions(e.target.value)}
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200">
                    Nilai Maksimal
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={taskMaxScore}
                    onChange={(e) => setTaskMaxScore(Number(e.target.value))}
                    className="w-full mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#16332d]">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-[#152e28]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-sm"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MATERIAL MODAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#10231f] rounded-3xl max-w-lg w-full p-6 border border-emerald-100 dark:border-[#1a3b34] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Unggah Materi Pembelajaran
            </h3>
            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">Judul Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul 3 - Pemrograman Frontend dengan React"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan isi modul atau tujuan pembelajaran..."
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200">
                    Tipe Konten
                  </label>
                  <select
                    value={matType}
                    onChange={(e) => setMatType(e.target.value as any)}
                    className="w-full mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                  >
                    <option value="pdf">Dokumen PDF</option>
                    <option value="doc">Dokumen / Slide</option>
                    <option value="video">Video Pembelajaran</option>
                    <option value="link">Tautan Web / Referensi</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200">
                    URL Tautan / Dokumen
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                    className="w-full mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#16332d]">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-[#152e28]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-sm"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#10231f] rounded-3xl max-w-md w-full p-6 border border-emerald-100 dark:border-[#1a3b34] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Beri Nilai & Masukan Siswa
            </h3>
            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Nilai Angka (Skor)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white text-base font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Umpan Balik / Catatan Guru
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Bagus sekali! Struktur program rapi dan modular..."
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#16332d]">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-[#152e28]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-sm"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
