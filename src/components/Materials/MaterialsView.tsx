import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  BookOpen,
  Search,
  FileText,
  Video,
  Link,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  Filter,
} from 'lucide-react';

export const MaterialsView: React.FC = () => {
  const { materials, classes, users, currentUser, deleteMaterial } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassId === 'all' || m.classId === selectedClassId;
    const matchesType = selectedType === 'all' || m.type === selectedType;

    return matchesSearch && matchesClass && matchesType;
  });

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'doc':
        return <BookOpen className="w-5 h-5 text-emerald-500" />;
      default:
        return <Link className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-cyan-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-400/30 mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Academic Library & Study Materials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Study Resources & Lecture Materials
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Browse lecture slides, Golang concurrency documentation, video tutorials, and reference materials published by course teachers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Class:
          </div>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.code}] {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold ml-2">
            Type:
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="doc">Doc / Slides</option>
            <option value="video">Video</option>
            <option value="link">Web Link</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((mat) => {
          const authorObj = users.find((u) => u.id === mat.authorId);
          const classObj = classes.find((c) => c.id === mat.classId);

          return (
            <div
              key={mat.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-cyan-300 dark:hover:border-cyan-800 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getMaterialIcon(mat.type)}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {classObj?.code || 'CS'}
                    </span>
                  </div>

                  {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                    <button
                      onClick={() => deleteMaterial(mat.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <img
                    src={
                      authorObj?.avatar ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                    }
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[11px] font-medium">{authorObj?.name || 'Instructor'}</span>
                </div>

                <a
                  href={mat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition shadow-sm"
                >
                  View Material <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
