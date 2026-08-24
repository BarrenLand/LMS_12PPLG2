import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { classes, users, setActiveTab, setSelectedClassId } = useLms();
  const [selectedDay, setSelectedDay] = useState<string>('Senin');

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const scheduleData: { [key: string]: Array<{
    id: string;
    classId: string;
    className: string;
    code: string;
    time: string;
    room: string;
    teacherName: string;
    color: string;
    status: 'selesai' | 'berlangsung' | 'mendatang';
  }> } = {
    Senin: [
      {
        id: 'sch-1',
        classId: 'cls-pplg2-web',
        className: 'Pemrograman Web & Go (PPLG 2)',
        code: 'PPLG-201',
        time: '08:00 - 10:30 WIB',
        room: 'Lab Komputer 3 (Gedung B)',
        teacherName: 'Pak Muhammad Daniel, S.Kom.',
        color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200',
        status: 'selesai',
      },
      {
        id: 'sch-2',
        classId: 'cls-mplb3-jp',
        className: 'Administrasi Server & Cloud Database',
        code: 'MPLB-302',
        time: '11:00 - 13:30 WIB',
        room: 'Ruang Teori 204 (Lantai 2)',
        teacherName: 'Bu Siti Rahmawati, M.Pd.',
        color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200',
        status: 'berlangsung',
      },
    ],
    Selasa: [
      {
        id: 'sch-3',
        classId: 'cls-pplg2-web',
        className: 'Rekayasa Perangkat Lunak & API Go',
        code: 'PPLG-202',
        time: '08:00 - 10:30 WIB',
        room: 'Lab RPL 1',
        teacherName: 'Pak Muhammad Daniel, S.Kom.',
        color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200',
        status: 'mendatang',
      },
    ],
    Rabu: [
      {
        id: 'sch-4',
        classId: 'cls-pplg2-web',
        className: 'Basis Data MongoDB & Aggregation',
        code: 'BD-101',
        time: '09:00 - 11:30 WIB',
        room: 'Lab Database',
        teacherName: 'Pak Ahmad Fauzi, M.Kom.',
        color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200',
        status: 'mendatang',
      },
    ],
    Kamis: [
      {
        id: 'sch-5',
        classId: 'cls-mplb3-jp',
        className: 'Keamanan Jaringan & Microservices',
        code: 'NET-201',
        time: '08:00 - 10:30 WIB',
        room: 'Lab Jaringan Komputer',
        teacherName: 'Pak Budi Santoso, S.Kom.',
        color: 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200',
        status: 'mendatang',
      },
    ],
    Jumat: [
      {
        id: 'sch-6',
        classId: 'cls-pplg2-web',
        className: 'Proyek Capstone Web Terintegrasi',
        code: 'CPS-401',
        time: '08:00 - 11:00 WIB',
        room: 'Lab Inovasi Digital',
        teacherName: 'Tim Dosen & Guru Pengampu',
        color: 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200',
        status: 'mendatang',
      },
    ],
  };

  const handleOpenClass = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab('materials');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Jadwal Pelajaran & Sesi Kuliah
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kalender jadwal mingguan kelas, ruang lab, dan dosen pengampu
          </p>
        </div>

        {/* Day Pills Selector */}
        <div className="flex items-center p-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs gap-1 overflow-x-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Jadwal Hari {selectedDay}</span>
            <span className="text-xs font-normal text-slate-400">
              ({scheduleData[selectedDay]?.length || 0} sesi pelajaran)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {scheduleData[selectedDay]?.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border-l-4 bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${item.color}`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 uppercase tracking-wider font-mono">
                    {item.code}
                  </span>
                  {item.status === 'berlangsung' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Sedang Berlangsung
                    </span>
                  )}
                  {item.status === 'selesai' && (
                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Selesai
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {item.className}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="truncate">{item.teacherName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenClass(item.classId)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition"
                >
                  Masuk Ruang Kelas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
