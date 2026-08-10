import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { AttendanceStatus } from '../../types';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Search,
  Filter,
  Edit2,
  RefreshCw,
  Clock,
  UserCheck,
} from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const {
    classes,
    users,
    attendanceSessions,
    attendanceRecords,
    adminOverrideAttendance,
  } = useLms();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Edit / Re-check Modal State
  const [recheckModalStudentId, setRecheckModalStudentId] = useState<string | null>(null);
  const [recheckStatus, setRecheckStatus] = useState<AttendanceStatus>('present');
  const [recheckNote, setRecheckNote] = useState('');

  const filteredSessions = attendanceSessions.filter((s) =>
    selectedClassId === 'all' ? true : s.classId === selectedClassId
  );

  const currentSession =
    attendanceSessions.find((s) => s.id === selectedSessionId) || filteredSessions[0];

  const currentClass = classes.find((c) => c.id === currentSession?.classId);
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && currentClass?.studentIds.includes(u.id)
  );

  const filteredEnrolledStudents = enrolledStudents.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenRecheck = (studentId: string, currentStat?: AttendanceStatus) => {
    setRecheckModalStudentId(studentId);
    setRecheckStatus(currentStat || 'present');
    setRecheckNote('Medical leave verified by admin');
  };

  const handleSaveRecheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession || !recheckModalStudentId) return;

    adminOverrideAttendance(
      currentSession.id,
      recheckModalStudentId,
      recheckStatus,
      recheckNote
    );

    setRecheckModalStudentId(null);
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
      {/* Admin Attendance Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator Attendance Re-Check Hub
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            System-Wide Attendance Audit & Overrides
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review teacher and student self check-ins, resolve attendance disputes, and re-check records with administrative notes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSessionId(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Classes ({classes.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Sessions Directory ({filteredSessions.length})</span>
          </h3>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No attendance sessions found.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredSessions.map((sess) => {
                const isSelected = currentSession?.id === sess.id;
                const cls = classes.find((c) => c.id === sess.classId);
                const sessRecords = attendanceRecords.filter((r) => r.sessionId === sess.id);
                const presentCount = sessRecords.filter((r) => r.status === 'present').length;

                return (
                  <div
                    key={sess.id}
                    onClick={() => setSelectedSessionId(sess.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-sm'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sess.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {cls?.code}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-600" />
                        {sess.date}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {presentCount} Present
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendance Records & Re-check View */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          {currentSession ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {currentSession.topic}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Class: {currentClass?.name} ({currentClass?.code}) • Date: {currentSession.date}
                  </p>
                </div>

                {/* Search in session */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Roster & Re-check Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Attendance Status</th>
                      <th className="p-3">Log / Method</th>
                      <th className="p-3 text-right">Admin Re-check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredEnrolledStudents.map((student) => {
                      const rec = attendanceRecords.find(
                        (r) => r.sessionId === currentSession.id && r.studentId === student.id
                      );

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

                          <td className="p-3">
                            {rec ? (
                              <div>
                                <span className="font-mono text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
                                  {rec.method}
                                </span>
                                {rec.notes && (
                                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                                    {rec.notes}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="italic text-slate-400 text-[11px]">Unmarked</span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleOpenRecheck(student.id, rec?.status)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Re-check
                            </button>
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
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Select an Attendance Session
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Choose a session on the left to re-check student records.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ADMIN RE-CHECK MODAL */}
      {recheckModalStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                Admin Attendance Re-Check
              </h3>
              <button
                onClick={() => setRecheckModalStudentId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRecheck} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Re-Checked Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRecheckStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition flex items-center justify-center gap-1.5 ${
                        recheckStatus === st
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Re-Check Justification Note
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Approved medical certificate submitted to school administration."
                  value={recheckNote}
                  onChange={(e) => setRecheckNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRecheckModalStudentId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
                >
                  Confirm Admin Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
