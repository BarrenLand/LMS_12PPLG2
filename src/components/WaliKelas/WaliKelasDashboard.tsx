import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { AttendanceStatus } from '../../types';
import {
  ShieldCheck,
  Users,
  Calendar,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Award,
  BookOpen,
  FileText,
  Search,
  MessageSquare,
  Sparkles,
  RefreshCw,
  School,
  FileCheck,
} from 'lucide-react';

export const WaliKelasDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    users,
    attendanceSessions,
    attendanceRecords,
    tasks,
    submissions,
    markAttendance,
  } = useLms();

  // Find Homeroom Class assigned to this Wali Kelas
  const homeroomClass =
    classes.find(
      (c) =>
        c.id === currentUser.homeroomClassId ||
        c.homeroomTeacherId === currentUser.id ||
        c.studentIds.includes('usr-student-1') // Fallback if not specified
    ) || classes[0];

  const homeroomStudents = users.filter(
    (u) =>
      (u.role === 'murid' || u.role === 'student') &&
      homeroomClass?.studentIds.includes(u.id)
  );

  const homeroomSessions = attendanceSessions.filter(
    (s) => s.classId === homeroomClass?.id
  );

  const [activeTab, setActiveTab] = useState<'attendance' | 'students' | 'performance'>('attendance');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSession =
    attendanceSessions.find((s) => s.id === selectedSessionId) || homeroomSessions[0];

  // Overall Homeroom Attendance Stats
  const totalHomeroomRecords = attendanceRecords.filter((r) =>
    homeroomSessions.some((s) => s.id === r.sessionId)
  );
  const presentRecordsCount = totalHomeroomRecords.filter((r) => r.status === 'present').length;
  const attendanceRate =
    totalHomeroomRecords.length > 0
      ? Math.round((presentRecordsCount / totalHomeroomRecords.length) * 100)
      : 100;

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
            Belum Dicatat
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Wali Kelas Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-amber-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <School className="w-4 h-4" /> Portal Wali Kelas (Homeroom Advisor)
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs text-amber-200/80 max-w-2xl">
              Kelas Binaan Wali Kelas: <span className="font-bold text-white">{homeroomClass?.name} ({homeroomClass?.code})</span>. Pantau kehadiran murid harian, perkembangan tugas akademik, serta koordinasi wali murid.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                Total Murid
              </p>
              <p className="text-xl font-black text-white">{homeroomStudents.length}</p>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center px-2">
              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                Tingkat Kehadiran
              </p>
              <p className="text-xl font-black text-emerald-400">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Kehadiran Murid Harian
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Daftar Murid Binaan ({homeroomStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'performance'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" /> Rekap Nilai & Progres Tugas
        </button>
      </div>

      {/* TAB 1: ATTENDANCE MONITORING */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Sesi Absensi Kelas ({homeroomSessions.length})</span>
            </h3>

            {homeroomSessions.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada sesi absensi dibuat untuk kelas ini.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {homeroomSessions.map((sess) => {
                  const isSelected = currentSession?.id === sess.id;
                  const sessRecs = attendanceRecords.filter((r) => r.sessionId === sess.id);
                  const presentCount = sessRecs.filter((r) => r.status === 'present').length;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => setSelectedSessionId(sess.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 shadow-sm'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {sess.topic || sess.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{sess.date}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {presentCount} / {homeroomStudents.length} Murid Hadir
                        </span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-medium">
                          {sess.isOpen ? 'Buka Absen' : 'Absen Tutup'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Roster & Record Review */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            {currentSession ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentSession.topic || currentSession.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tanggal: {currentSession.date} • Kelas Binaan Wali Kelas
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Nama Murid</th>
                        <th className="p-3">Status Absen</th>
                        <th className="p-3">Waktu & Catatan Wali Kelas</th>
                        <th className="p-3 text-right">Ubah Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {homeroomStudents.map((st) => {
                        const rec = attendanceRecords.find(
                          (r) => r.sessionId === currentSession.id && r.studentId === st.id
                        );

                        return (
                          <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={st.avatar}
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-slate-100">
                                    {st.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{st.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">{getStatusBadge(rec?.status)}</td>

                            <td className="p-3 text-[11px] text-slate-500">
                              {rec ? (
                                <div>
                                  <p className="font-mono text-[10px] text-slate-400">
                                    {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sesi'}
                                  </p>
                                  {rec.notes && <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{rec.notes}</p>}
                                </div>
                              ) : (
                                <span className="italic text-slate-400">Belum diisi</span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, st.id, 'present', 'Diverifikasi Wali Kelas')
                                  }
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    rec?.status === 'present'
                                      ? 'bg-emerald-600 text-white'
                                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                                  }`}
                                >
                                  Hadir
                                </button>
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, st.id, 'absent', 'Diisi Wali Kelas')
                                  }
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    rec?.status === 'absent'
                                      ? 'bg-rose-600 text-white'
                                      : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                                  }`}
                                >
                                  Alfa
                                </button>
                                <button
                                  onClick={() =>
                                    markAttendance(currentSession.id, st.id, 'excused', 'Izin resmi wali murid')
                                  }
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    rec?.status === 'excused'
                                      ? 'bg-purple-600 text-white'
                                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                                  }`}
                                >
                                  Izin
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
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Pilih Sesi Absensi
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROSTER MURID & CONTACT INFO */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Daftar Murid Kelas Binaan Wali Kelas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring profil individual murid dan catatan perkembangan wali murid.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari murid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeroomStudents
              .filter(
                (st) =>
                  st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  st.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((student) => {
                const stSubmissions = submissions.filter((s) => s.studentId === student.id);
                const stRecords = attendanceRecords.filter((r) => r.studentId === student.id);
                const presentCount = stRecords.filter((r) => r.status === 'present').length;

                return (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">{student.email}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Absensi</p>
                        <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {presentCount} Hadir
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Tugas Terkumpul</p>
                        <p className="font-extrabold text-blue-600 dark:text-blue-400">
                          {stSubmissions.length} Submitted
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Rekapitualisasi Nilai Tugas Murid Binaan
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Nama Murid</th>
                  <th className="p-3">Tugas Terkumpul</th>
                  <th className="p-3">Rata-Rata Nilai</th>
                  <th className="p-3">Status Evaluasi Wali Kelas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {homeroomStudents.map((st) => {
                  const stSubs = submissions.filter((s) => s.studentId === st.id);
                  const gradedSubs = stSubs.filter((s) => s.score !== undefined);
                  const avgScore =
                    gradedSubs.length > 0
                      ? Math.round(
                          gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                            gradedSubs.length
                        )
                      : null;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                        {st.name}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {stSubs.length} Tugas
                      </td>
                      <td className="p-3 font-black text-amber-600 dark:text-amber-400">
                        {avgScore !== null ? `${avgScore} / 100` : 'Belum Ada Nilai'}
                      </td>
                      <td className="p-3">
                        {avgScore !== null && avgScore >= 85 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Sangat Baik
                          </span>
                        ) : avgScore !== null && avgScore >= 70 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            Baik
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Perlu Pembinaan
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
