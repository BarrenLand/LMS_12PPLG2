import React, { useState } from 'react';
import { GOLANG_BACKEND_FILES } from '../../data/golangSourceCode';
import { useLms } from '../../context/LmsContext';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Play,
  FileCode,
  Server,
  Layers,
  Database,
  Sparkles,
} from 'lucide-react';

export const GolangExporterModal: React.FC = () => {
  const { classes, users, submissions, materials, forumPosts } = useLms();

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // API Playground State
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/admin/classes');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);

  const activeFile = GOLANG_BACKEND_FILES[activeFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunApiTest = () => {
    setLoadingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      setLoadingApi(false);

      if (selectedEndpoint === '/api/v1/admin/classes') {
        setApiResponse(JSON.stringify(classes, null, 2));
      } else if (selectedEndpoint === '/api/v1/admin/users') {
        setApiResponse(JSON.stringify(users, null, 2));
      } else if (selectedEndpoint === '/api/v1/student/submissions') {
        setApiResponse(JSON.stringify(submissions, null, 2));
      } else if (selectedEndpoint === '/api/v1/student/materials') {
        setApiResponse(JSON.stringify(materials, null, 2));
      } else if (selectedEndpoint === '/api/v1/forum/posts') {
        setApiResponse(JSON.stringify(forumPosts, null, 2));
      } else {
        setApiResponse(
          JSON.stringify(
            {
              status: 200,
              message: 'Golang Gin REST API Endpoint Executed Successfully',
              timestamp: new Date().toISOString(),
              data: { endpoint: selectedEndpoint, method: httpMethod },
            },
            null,
            2
          )
        );
      }
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-400/30">
            <Server className="w-3.5 h-3.5" /> Golang Backend Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Go Language Source Code & REST API Schema
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            This LMS system is modeled on a production Go 1.22 REST API using <strong>Gin Web Framework</strong>, <strong>GORM ORM</strong>, and PostgreSQL/SQLite database models for Admin, Teacher, and Student roles.
          </p>
        </div>
      </div>

      {/* Code Inspector Section */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* File Switcher Header */}
        <div className="flex flex-wrap items-center justify-between bg-slate-950/80 px-4 py-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {GOLANG_BACKEND_FILES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
                  activeFileIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Code!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>

        {/* File Description */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400 font-mono">
          📌 {activeFile.description}
        </div>

        {/* Code Content View */}
        <div className="p-6 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs text-cyan-200/90 leading-relaxed bg-slate-950/90">
          <pre>{activeFile.code}</pre>
        </div>
      </div>

      {/* Interactive API Tester */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Interactive Golang REST API Playground
            </h2>
          </div>
          <span className="text-xs text-slate-500">Live JSON response simulation</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-mono font-extrabold">
            {httpMethod}
          </span>

          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="flex-1 w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
          >
            <option value="/api/v1/admin/classes">GET /api/v1/admin/classes (Admin Classes)</option>
            <option value="/api/v1/admin/users">GET /api/v1/admin/users (Admin Users)</option>
            <option value="/api/v1/student/submissions">
              GET /api/v1/student/submissions (GDrive Submissions)
            </option>
            <option value="/api/v1/student/materials">
              GET /api/v1/student/materials (Study Materials)
            </option>
            <option value="/api/v1/forum/posts">GET /api/v1/forum/posts (Forum Discussions)</option>
          </select>

          <button
            onClick={handleRunApiTest}
            disabled={loadingApi}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            {loadingApi ? 'Executing Request...' : 'Send Test Request'}
          </button>
        </div>

        {apiResponse && (
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-emerald-400 max-h-72 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-2">
              <span>HTTP/1.1 200 OK</span>
              <span>Content-Type: application/json</span>
            </div>
            <pre>{apiResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
