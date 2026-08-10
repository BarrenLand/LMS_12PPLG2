import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  XCircle,
  Check,
  Sparkles,
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const {
    currentUser,
    classes,
    attendanceSessions,
    attendanceRecords,
    studentSelfCheckIn,
  } = useLms();

  const myEnrolledClasses = classes.filter(
    (c) => c.studentIds && c.studentIds.includes(currentUser.id)
  );
  const myClassIds = myEnrolledClasses.map((c) => c.id);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);

  // Active or past sessions for student's classes
  const myClassSessions = attendanceSessions.filter((s) =>
    myClassIds.includes(s.classId)
  );

  const handleSelfCheckIn = (sessionId: string) => {
    setNotification(null);
    const res = studentSelfCheckIn(sessionId, currentUser.id);

    if (res.success) {
      setNotification({ type: 'success', msg: res.message });
    } else {
      setNotification({ type: 'error', msg: res.message });
    }

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Student records summary
  const myRecords = attendanceRecords.filter((r) => r.studentId === currentUser.id);
  const presentCount = myRecords.filter((r) => r.status === 'present').length;
  const totalSessionsCount = myClassSessions.length;
  const attendancePercentage =
    totalSessionsCount > 0 ? Math.round((presentCount / totalSessionsCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Self Check-In Attendance Portal
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Daily Attendance & Class Check-In
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Perform self-check-in when your teacher opens an active class session.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Attendance Rate
            </p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {attendancePercentage}%
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sessions Present
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {presentCount} / {totalSessionsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 shadow-md ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/90 border-rose-800 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Class Sessions List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Class Check-In Sessions ({myClassSessions.length})
        </h3>

        {myClassSessions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Active Attendance Sessions Right Now
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Your teachers will create attendance sessions during class hours for self-check-in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myClassSessions.map((sess) => {
              const classObj = classes.find((c) => c.id === sess.classId);
              const rec = attendanceRecords.find(
                (r) => r.sessionId === sess.id && r.studentId === currentUser.id
              );
              const isCheckedIn = rec?.status === 'present';

              return (
                <div
                  key={sess.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                    sess.isOpen
                      ? 'border-blue-400 dark:border-blue-800/80 ring-1 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {classObj?.code || 'COURSE'}
                      </span>

                      {sess.isOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse">
                          <Sparkles className="w-3 h-3" /> Check-In OPEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Session Closed
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                      {sess.topic}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Class: {classObj?.name} • Date: {sess.date}
                    </p>

                    {/* Attendance Record Status */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">My Record Status:</span>
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Present
                        </span>
                      ) : rec ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 capitalize">
                          {rec.status}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not Checked In</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    {isCheckedIn ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 cursor-default"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        Check-In Recorded (Present)
                      </button>
                    ) : sess.isOpen ? (
                      <button
                        onClick={() => handleSelfCheckIn(sess.id)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Self Check-In Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed text-center"
                      >
                        Check-In Closed by Instructor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
