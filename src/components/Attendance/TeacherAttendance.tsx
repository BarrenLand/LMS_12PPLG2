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
  const [sessionTitle, setSessionTitle] = useState('Presensi Jam Pelajaran Reguler');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter sessions for selected class
  const classSessions = attendanceSessions.filter((s) => s.classId === selectedClassId);
  const activeClass = classes.find((c) => c.id === selectedClassId);
  const enrolledStudents = users.filter(
    (u) => (u.role === 'student' || u.role === 'murid') && activeClass?.studentIds?.includes(u.id)
  );

  const currentSession =
    attendanceSessions.find((s) => s.id === selectedSessionId) || classSessions[0];

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
      case 'hadir':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-[#15312b] dark:text-[#34d399] border border-emerald-200 dark:border-[#1e463d]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hadir
          </span>
        );
      case 'absent':
      case 'alfa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-[#331c1e] dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
            <XCircle className="w-3.5 h-3.5" /> Alfa
          </span>
        );
      case 'late':
      case 'izin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-[#152a3a] dark:text-cyan-300 border border-blue-200 dark:border-blue-900/40">
            <AlertTriangle className="w-3.5 h-3.5" /> Izin
          </span>
        );
      case 'excused':
      case 'sakit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-[#281b38] dark:text-purple-300 border border-purple-200 dark:border-purple-900/40">
            <HelpCircle className="w-3.5 h-3.5" /> Sakit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-[#152924] dark:text-slate-400">
            Belum Tercatat
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Class Selector & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#10231f] p-5 rounded-3xl border border-emerald-100 dark:border-[#1a3b34] shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#10b981]" />
            Manajemen Presensi & Sesi Mapel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buat sesi absensi langsung, buka/tutup presensi mandiri siswa, atau rekam kehadiran manual.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSessionId(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10b981]"
          >
            {myClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Buat Sesi Baru
          </button>
        </div>
      </div>

      {/* Main Grid: Sessions List on Left, Student Roster on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions Sidebar */}
        <div className="bg-white dark:bg-[#10231f] rounded-3xl border border-emerald-100 dark:border-[#1a3b34] p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Daftar Sesi ({classSessions.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">{activeClass?.code}</span>
          </h3>

          {classSessions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-[#1e463d] rounded-2xl p-4">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Belum ada sesi presensi dibuat.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-3 text-xs text-[#10b981] font-bold hover:underline"
              >
                + Buat Sesi Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {classSessions.map((sess) => {
                const isSelected = currentSession?.id === sess.id;
                const sessRecords = attendanceRecords.filter((r) => r.sessionId === sess.id);
                const presentCount = sessRecords.filter(
                  (r) => r.status === 'present' || r.status === 'hadir'
                ).length;

                return (
                  <div
                    key={sess.id}
                    onClick={() => setSelectedSessionId(sess.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-[#15312b] border-[#10b981] shadow-sm'
                        : 'bg-slate-50/60 dark:bg-[#122924] border-slate-200 dark:border-[#1e463d] hover:border-emerald-300'
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
                        title="Hapus sesi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{new Date(sess.date).toLocaleDateString('id-ID')}</span>
                      <span className="font-semibold text-[#064e3b] dark:text-[#34d399]">
                        {presentCount} Hadir
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#1e463d] flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sess.isOpen
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {sess.isOpen ? 'Sesi Dibuka (Live)' : 'Sesi Ditutup'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAttendanceSessionOpen(sess.id);
                        }}
                        className="text-[11px] font-bold text-[#059669] dark:text-[#34d399] hover:underline"
                      >
                        {sess.isOpen ? 'Tutup Sesi' : 'Buka Sesi'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Student Roster & Live Marking on Right */}
        <div className="lg:col-span-2 bg-white dark:bg-[#10231f] rounded-3xl border border-emerald-100 dark:border-[#1a3b34] p-5 space-y-4">
          {currentSession ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#16332d]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentSession.topic}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentSession.isOpen
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {currentSession.isOpen ? 'Status: Terbuka' : 'Status: Ditutup'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tanggal Sesi: {new Date(currentSession.date).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <button
                  onClick={() => toggleAttendanceSessionOpen(currentSession.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    currentSession.isOpen
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentSession.isOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {currentSession.isOpen ? 'Tutup Sesi Ini' : 'Buka Sesi Ini'}
                </button>
              </div>

              {/* Student List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-[#16332d] text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Siswa</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Aksi Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#16332d]">
                    {enrolledStudents.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-400">
                          Belum ada data siswa di kelas ini.
                        </td>
                      </tr>
                    ) : (
                      enrolledStudents.map((student) => {
                        const record = getRecordForStudent(currentSession.id, student.id);
                        return (
                          <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-[#122924]">
                            <td className="py-3 px-2 flex items-center gap-2.5">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {student.name}
                                </p>
                                <p className="text-[11px] text-slate-400">{student.email}</p>
                              </div>
                            </td>

                            <td className="py-3 px-2">
                              {getStatusBadge(record?.status as any)}
                            </td>

                            <td className="py-3 px-2 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, student.id, 'present' as any)
                                  }
                                  className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-[#143029] text-[#059669] dark:text-[#34d399] font-bold text-[11px] hover:bg-emerald-100"
                                >
                                  Hadir
                                </button>
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, student.id, 'late' as any)
                                  }
                                  className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-[#122736] text-blue-700 dark:text-cyan-300 font-bold text-[11px] hover:bg-blue-100"
                                >
                                  Izin
                                </button>
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, student.id, 'excused' as any)
                                  }
                                  className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-[#201830] text-purple-700 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-100"
                                >
                                  Sakit
                                </button>
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, student.id, 'absent' as any)
                                  }
                                  className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-[#2c181a] text-rose-700 dark:text-rose-400 font-bold text-[11px] hover:bg-rose-100"
                                >
                                  Alfa
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              Pilih sesi di sebelah kiri untuk melihat dan menandai daftar hadir siswa.
            </div>
          )}
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#10231f] rounded-3xl max-w-md w-full p-6 border border-emerald-100 dark:border-[#1a3b34] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Buat Sesi Presensi Baru
            </h3>
            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Topik / Nama Pertemuan
                </label>
                <input
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="Contoh: Pertemuan 4 - Routing dan Middleware"
                  className="w-full mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Tanggal Presensi
                </label>
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#122924] border border-slate-200 dark:border-[#1e463d] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#16332d]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-[#152e28]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-sm"
                >
                  Simpan & Buka Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
