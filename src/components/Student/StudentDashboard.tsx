import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Task, TaskSubmission } from '../../types';
import { StudentAttendance } from '../Attendance/StudentAttendance';
import {
  GraduationCap,
  FileText,
  Link2,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  ExternalLink,
  Award,
  AlertCircle,
  FileCheck,
  Search,
  UserCheck,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    tasks,
    submissions,
    materials,
    users,
    submitTask,
  } = useLms();

  // Student enrolled classes
  const myEnrolledClasses = classes.filter(
    (c) => c.studentIds && c.studentIds.includes(currentUser.id)
  );

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [activeStudentTab, setActiveStudentTab] = useState<'tasks' | 'attendance'>('tasks');

  // Filter tasks for student's classes
  const myClassIds = myEnrolledClasses.map((c) => c.id);
  const eligibleTasks = tasks.filter((t) =>
    selectedClassId === 'all'
      ? myClassIds.includes(t.classId)
      : t.classId === selectedClassId
  );

  // Modal for submitting GDrive Link
  const [submittingTask, setSubmittingTask] = useState<Task | null>(null);
  const [gdriveInputUrl, setGdriveInputUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [urlError, setUrlError] = useState('');

  // Calculate student performance stats
  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);
  const gradedSubmissions = mySubmissions.filter((s) => s.score !== undefined);
  const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const avgScore =
    gradedSubmissions.length > 0 ? Math.round(totalScore / gradedSubmissions.length) : null;

  // Open Task Submission modal
  const handleOpenSubmitModal = (task: Task) => {
    const existing = submissions.find(
      (s) => s.taskId === task.id && s.studentId === currentUser.id
    );

    setSubmittingTask(task);
    setGdriveInputUrl(
      existing?.gdriveUrl ||
        `https://drive.google.com/file/d/1${Math.random()
          .toString(36)
          .substring(2, 12)}_Solution/view?usp=sharing`
    );
    setSubmissionNote(existing?.note || '');
    setUrlError('');
  };

  // Submit Handler
  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;

    if (
      !gdriveInputUrl.includes('drive.google.com') &&
      !gdriveInputUrl.includes('docs.google.com')
    ) {
      setUrlError('Please enter a valid Google Drive URL (e.g., https://drive.google.com/...)');
      return;
    }

    submitTask(submittingTask.id, gdriveInputUrl, submissionNote);
    setSubmittingTask(null);
  };

  return (
    <div className="space-y-8">
      {/* Student Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5" /> Student Learning Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Access study materials, upload your Google Drive task solution links, and view your graded feedback.
          </p>

          {/* Enrolled Classes Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedClassId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedClassId === 'all'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              All Enrolled Classes ({myEnrolledClasses.length})
            </button>
            {myEnrolledClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedClassId === cls.id
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                <span className="font-mono text-[11px] opacity-80">{cls.code}</span>
                <span>{cls.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Enrolled Classes
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {myEnrolledClasses.length}
          </p>
          <span className="text-[11px] text-slate-400">Active Placement</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Assigned Tasks
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {eligibleTasks.length}
          </p>
          <span className="text-[11px] text-slate-400">Course Assignments</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Submitted via GDrive
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {mySubmissions.length}
          </p>
          <span className="text-[11px] text-slate-400">Solutions Uploaded</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Average Grade Score
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {avgScore !== null ? `${avgScore} / 100` : 'N/A'}
          </p>
          <span className="text-[11px] text-slate-400">
            {gradedSubmissions.length} Graded Tasks
          </span>
        </div>
      </div>

      {/* Student Portal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveStudentTab('tasks')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            activeStudentTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Course Tasks & GDrive Submissions ({eligibleTasks.length})
        </button>
        <button
          onClick={() => setActiveStudentTab('attendance')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            activeStudentTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Daily Attendance Check-In
        </button>
      </div>

      {/* TASKS & GDRIVE SUBMISSIONS SECTION */}
      {activeStudentTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              My Course Tasks & Google Drive Submissions
            </h2>
            <span className="text-xs text-slate-500">
              Click "Submit GDrive Link" to submit your solution
            </span>
          </div>

        {eligibleTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Pending Tasks Found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Check back later for new tasks from your course teachers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eligibleTasks.map((task) => {
              const mySub = submissions.find(
                (s) => s.taskId === task.id && s.studentId === currentUser.id
              );
              const classObj = classes.find((c) => c.id === task.classId);
              const teacherObj = users.find((u) => u.id === task.teacherId);

              return (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {classObj?.code || 'CLASS'}
                      </span>

                      {mySub ? (
                        mySub.score !== undefined ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Score: {mySub.score} /{' '}
                            {task.maxScore}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" /> Submitted (Awaiting Grade)
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5" /> Not Submitted Yet
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {task.instructions}
                    </p>

                    {/* Submission Details if submitted */}
                    {mySub && (
                      <div className="mt-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-blue-900 dark:text-blue-300">
                            My Submitted Solution:
                          </span>
                          <span className="text-slate-400">
                            {new Date(mySub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <a
                          href={mySub.gdriveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate"
                        >
                          <Link2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{mySub.gdriveUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>

                        {mySub.feedback && (
                          <div className="pt-2 mt-2 border-t border-blue-200/80 dark:border-blue-800/80">
                            <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                              Teacher Feedback:
                            </p>
                            <p className="text-xs text-slate-700 dark:text-slate-200 italic mt-0.5">
                              "{mySub.feedback}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>

                    <button
                      onClick={() => handleOpenSubmitModal(task)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {mySub ? 'Resubmit GDrive Link' : 'Submit GDrive Link'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* ATTENDANCE CHECK-IN SECTION */}
      {activeStudentTab === 'attendance' && <StudentAttendance />}

      {/* SUBMIT GOOGLE DRIVE LINK MODAL */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Submit Task Solution via Google Drive
                </h3>
                <p className="text-xs text-slate-500">{submittingTask.title}</p>
              </div>
              <button
                onClick={() => setSubmittingTask(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubmission} className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Link2 className="w-4 h-4" /> Google Drive Link Instructions:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Upload your code zip or project folder to Google Drive. Ensure link sharing permission is set to <strong>"Anyone with the link can view"</strong> so your teacher can review and grade your solution.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Drive Link URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={gdriveInputUrl}
                  onChange={(e) => {
                    setGdriveInputUrl(e.target.value);
                    setUrlError('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                {urlError && <p className="text-xs text-red-600 font-medium mt-1">{urlError}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Note to Teacher (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional notes regarding your implementation or execution instructions..."
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Confirm GDrive Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
