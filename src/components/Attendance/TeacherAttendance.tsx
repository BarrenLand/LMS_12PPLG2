import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { AttendanceSession, AttendanceStatus } from '../../types';
import {
  Calendar,
  Clock,
  UserCheck,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Search,
  Check,
  Eye,
} from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const {
    currentUser,
    classes,
    users,
    attendanceSessions,
    attendanceRecords,
    createAttendanceSession,
    toggleAttendanceSessionOpen,
    deleteAttendanceSession,
    markAttendance,
  } = useLms();

  const myClasses = classes.filter(
    (c) => c.teacherId === currentUser.id || currentUser.role === 'admin'
  );

  const [selectedClassId, setSelectedClassId] = useState<string>(
    myClasses[0]?.id || classes[0]?.id || ''
  );

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // New Session Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('Regular Lecture Check-In');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter sessions for selected class
  const classSessions = attendanceSessions.filter((s) => s.classId === selectedClassId);
  const activeClass = classes.find((c) => c.id === selectedClassId);
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && activeClass?.studentIds.includes(u.id)
  );

  const currentSession = attendanceSessions.find((s) => s.id === selectedSessionId) || classSessions[0];

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !sessionTitle.trim()) return;

    const newSess = createAttendanceSession({
      classId: selectedClassId,
      date: sessionDate,
      topic: sessionTitle,
      isOpen: true,
      createdById: currentUser.id,
    });

    setSelectedSessionId(newSess.id);
    setShowCreateModal(false);
  };

  const getRecordForStudent = (sessionId: string, studentId: string) => {
    return attendanceRecords.find(
      (r) => r.sessionId === sessionId && r.studentId === studentId
    );
  };

  const getStatusBadge = (status?: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Late
          </span>
        );
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            <HelpCircle className="w-3.5 h-3.5" /> Excused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Unmarked
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Class Selector & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Class Attendance Management
          </h2>
          <p className="text-xs text-slate-500">
            Create attendance check-in sessions, toggle student self-attendance, and mark attendance status.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSessionId(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          >
            {myClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Session
          </button>
        </div>
      </div>

      {/* Main Grid: Sessions List on Left, Student Roster on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Attendance Sessions ({classSessions.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">{activeClass?.code}</span>
          </h3>

          {classSessions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No attendance sessions created yet.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
              >
                + Create First Session
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {classSessions.map((sess) => {
                const isSelected = currentSession?.id === sess.id;
                const sessRecords = attendanceRecords.filter((r) => r.sessionId === sess.id);
                const presentCount = sessRecords.filter((r) => r.status === 'present').length;

                return (
                  <div
                    key={sess.id}
                    onClick={() => setSelectedSessionId(sess.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sess.topic}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAttendanceSession(sess.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {sess.date}
                      </span>

                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {presentCount} / {enrolledStudents.length} Present
                      </span>
                    </div>

                    {/* Self Check-In Status Toggle */}
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Student Self Check-In:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAttendanceSessionOpen(sess.id, !sess.isOpen);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          sess.isOpen
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {sess.isOpen ? (
                          <>
                            <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> Open
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-3.5 h-3.5 text-slate-400" /> Closed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Roster & Marking Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          {currentSession ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentSession.topic}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        currentSession.isOpen
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {currentSession.isOpen ? 'Self-Check-In OPEN' : 'Self-Check-In CLOSED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Session Date: {currentSession.date} • Class Enrolment: {enrolledStudents.length} Students
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      enrolledStudents.forEach((st) => {
                        markAttendance(currentSession.id, st.id, 'present', 'Bulk Marked Present');
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                  >
                    Mark All Present
                  </button>
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Method / Notes</th>
                      <th className="p-3 text-right">Set Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {enrolledStudents.map((student) => {
                      const rec = getRecordForStudent(currentSession.id, student.id);

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={student.avatar}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100">
                                  {student.name}
                                </p>
                                <p className="text-[10px] text-slate-400">{student.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">{getStatusBadge(rec?.status)}</td>

                          <td className="p-3 text-slate-500 text-[11px]">
                            {rec ? (
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                                  {rec.method?.replace('_', ' ')}
                                </span>
                                {rec.notes && <p className="text-[10px] text-slate-400 italic">{rec.notes}</p>}
                              </div>
                            ) : (
                              <span className="italic text-slate-400">Not recorded yet</span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                              <button
                                onClick={() =>
                                  markAttendance(currentSession.id, student.id, 'present', 'Teacher marked')
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                                  rec?.status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                                }`}
                                title="Mark Present"
                              >
                                Present
                              </button>
                              <button
                                onClick={() =>
                                  markAttendance(currentSession.id, student.id, 'absent', 'Teacher marked')
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                                  rec?.status === 'absent'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                                }`}
                                title="Mark Absent"
                              >
                                Absent
                              </button>
                              <button
                                onClick={() =>
                                  markAttendance(currentSession.id, student.id, 'late', 'Teacher marked')
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                                  rec?.status === 'late'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
                                }`}
                                title="Mark Late"
                              >
                                Late
                              </button>
                              <button
                                onClick={() =>
                                  markAttendance(currentSession.id, student.id, 'excused', 'Teacher marked')
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                                  rec?.status === 'excused'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                                }`}
                                title="Mark Excused"
                              >
                                Excused
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Select or Create an Attendance Session
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Choose a session from the left panel to record or review student check-ins.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Attendance Session
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Topic / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session 5: Golang Routines & Channels"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Start Attendance Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
