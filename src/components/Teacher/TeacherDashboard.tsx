import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Task, StudyMaterial, TaskSubmission } from '../../types';
import { TeacherAttendance } from '../Attendance/TeacherAttendance';
import {
  FileText,
  Upload,
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  Sparkles,
  Link2,
  FileCheck,
  Search,
  Filter,
  UserCheck,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    materials,
    tasks,
    submissions,
    users,
    addTask,
    deleteTask,
    addMaterial,
    deleteMaterial,
    gradeSubmission,
  } = useLms();

  // Teacher classes
  const myClasses = classes.filter(
    (c) => c.teacherId === currentUser.id || currentUser.role === 'admin'
  );

  const [selectedClassId, setSelectedClassId] = useState<string>(
    myClasses[0]?.id || classes[0]?.id || ''
  );

  const activeClass = classes.find((c) => c.id === selectedClassId);

  // Tab State inside Teacher Portal
  const [activeTeacherTab, setActiveTeacherTab] = useState<
    'tasks' | 'submissions' | 'materials' | 'attendance'
  >('tasks');

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
    <div className="space-y-8">
      {/* Teacher Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 mb-3">
            <Award className="w-3.5 h-3.5" /> Instructor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Teacher Task, Scores & Material Control
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Upload assignments, share study materials, review student Google Drive submissions, and assign scores with feedback.
          </p>

          {/* Class Picker */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Selected Class:
            </span>
            <div className="flex flex-wrap gap-2">
              {myClasses.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedClassId === cls.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-extrabold'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <span className="font-mono">{cls.code}</span>
                  <span>{cls.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTeacherTab('tasks')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTeacherTab === 'tasks'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tasks & Assignments ({classTasks.length})
          </button>
          <button
            onClick={() => setActiveTeacherTab('submissions')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTeacherTab === 'submissions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Submissions & Grading ({classSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTeacherTab('materials')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTeacherTab === 'materials'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Study Materials ({classMaterials.length})
          </button>
          <button
            onClick={() => setActiveTeacherTab('attendance')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 ${
              activeTeacherTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Class Attendance
          </button>
        </div>

        <div>
          {activeTeacherTab === 'tasks' && (
            <button
              onClick={() => setShowTaskModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create New Task
            </button>
          )}
          {activeTeacherTab === 'materials' && (
            <button
              onClick={() => setShowMaterialModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Upload className="w-4 h-4" /> Upload Material
            </button>
          )}
        </div>
      </div>

      {/* TASKS TAB */}
      {activeTeacherTab === 'tasks' && (
        <div className="space-y-4">
          {classTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Tasks Created Yet for {activeClass?.name || 'this class'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click below to upload an assignment and prompt students for Google Drive submissions.
              </p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Create First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classTasks.map((task) => {
                const taskSubs = submissions.filter((s) => s.taskId === task.id);
                const gradedCount = taskSubs.filter((s) => s.score !== undefined).length;

                return (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          Max Score: {task.maxScore} pts
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                          {task.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {task.instructions}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>

                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {taskSubs.length} Submissions ({gradedCount} Graded)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBMISSIONS & GRADING TAB */}
      {activeTeacherTab === 'submissions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {classSubmissions.length === 0 ? (
            <div className="text-center py-12 p-8">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Student Submissions Received Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Students will upload their Google Drive solution links here for grading.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Task Name</th>
                    <th className="p-4">Submitted GDrive Solution</th>
                    <th className="p-4">Submitted At</th>
                    <th className="p-4">Score & Status</th>
                    <th className="p-4 text-right">Grade Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {classSubmissions.map((sub) => {
                    const studentObj = users.find((u) => u.id === sub.studentId);
                    const taskObj = tasks.find((t) => t.id === sub.taskId);

                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                studentObj?.avatar ||
                                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
                              }
                              alt=""
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">
                                {studentObj?.name || sub.studentId}
                              </p>
                              <p className="text-[10px] text-slate-400">{studentObj?.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                          {taskObj?.title || sub.taskId}
                        </td>

                        <td className="p-4">
                          <div className="space-y-1">
                            <a
                              href={sub.gdriveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline"
                            >
                              <Link2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[200px] font-mono text-[11px]">
                                {sub.gdriveUrl}
                              </span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                            {sub.note && (
                              <p className="text-[11px] text-slate-500 italic">
                                "{sub.note}"
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-slate-500 text-[11px]">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </td>

                        <td className="p-4">
                          {sub.score !== undefined ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {sub.score} / {taskObj?.maxScore || 100}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">
                              <Clock className="w-3.5 h-3.5" /> Pending Grading
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenGrading(sub)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                          >
                            {sub.score !== undefined ? 'Edit Grade' : 'Grade & Score'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MATERIALS TAB */}
      {activeTeacherTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {mat.type} Document
                  </span>
                  <button
                    onClick={() => deleteMaterial(mat.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {new Date(mat.createdAt).toLocaleDateString()}
                </span>
                <a
                  href={mat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Access Study File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTeacherTab === 'attendance' && <TeacherAttendance />}

      {/* TASK CREATION MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create New Assignment / Task
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Golang Fiber API & GORM Schema"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions for Students
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail instructions... Remind students to upload their solution folder/zip to Google Drive and paste the share link."
                  value={taskInstructions}
                  onChange={(e) => setTaskInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Max Score Points
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={taskMaxScore}
                    onChange={(e) => setTaskMaxScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MATERIAL MODAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Upload Study Material
              </h3>
              <button
                onClick={() => setShowMaterialModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Material Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golang Concurrency & Channels Cheat Sheet"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Document Type
                  </label>
                  <select
                    value={matType}
                    onChange={(e) =>
                      setMatType(e.target.value as 'pdf' | 'video' | 'link' | 'doc')
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="doc">Lecture Slides / Doc</option>
                    <option value="video">Video Recording Link</option>
                    <option value="link">Web Resource Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Document / File URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://go.dev/doc/effective_go"
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Topic Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of study topic..."
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Grade Submission & Feedback
              </h3>
              <button onClick={() => setGradingSub(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Submitted Solution Link
              </p>
              <a
                href={gradingSub.gdriveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 break-all"
              >
                <Link2 className="w-4 h-4 shrink-0" />
                {gradingSub.gdriveUrl}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              {gradingSub.note && (
                <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  Student Note: "{gradingSub.note}"
                </p>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Score Points (Max 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Feedback & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Save Score & Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
