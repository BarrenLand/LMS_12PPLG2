import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  ArrowRight,
  Code2,
  KeyRound,
  Check
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { users, login, loginAsUser } = useLms();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');

  // Credentials Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Group demo users by role
  const adminUsers = users.filter((u) => u.role === 'admin');
  const teacherUsers = users.filter((u) => u.role === 'teacher');
  const studentUsers = users.filter((u) => u.role === 'student');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid email or password.');
    } else {
      setSuccessMessage('Login successful! Redirecting to dashboard...');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <ShieldCheck className="w-3.5 h-3.5" /> System Admin
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="w-3.5 h-3.5" /> Teacher / Instructor
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <GraduationCap className="w-3.5 h-3.5" /> Student
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> Golang 1.22 REST API & GORM Backend
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 font-extrabold text-2xl">
              G
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Go<span className="text-cyan-400">LMS</span> Portal
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Multi-tier Learning Management System. Select a user role or sign in with account credentials to access role-specific dashboards.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Auth Navigation Tabs */}
          <div className="flex items-center justify-center p-1.5 bg-slate-950 rounded-2xl border border-slate-800 max-w-sm mx-auto mb-8">
            <button
              onClick={() => {
                setActiveTab('quick');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'quick'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Role Login
            </button>

            <button
              onClick={() => {
                setActiveTab('credentials');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'credentials'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Credentials
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: 1-Click Role Persona Selection */}
          {activeTab === 'quick' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-white">Select Your Account Level</h2>
                <p className="text-xs text-slate-400">
                  Click any profile card below to immediately log in and explore role-specific permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* ADMIN CARD */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {getRoleBadge('admin')}
                      <span className="text-[10px] font-mono text-purple-400">Level 1</span>
                    </div>

                    <div className="space-y-3">
                      {adminUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/40"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Create & manage all user accounts
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Assign teachers to academic classes
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Full Golang REST API & DB schema view
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => loginAsUser(adminUsers[0]?.id || 'usr-admin-1')}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 group-hover:scale-[1.02]"
                  >
                    <span>Log In as Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* TEACHER CARD */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {getRoleBadge('teacher')}
                      <span className="text-[10px] font-mono text-emerald-400">Level 2</span>
                    </div>

                    <div className="space-y-3">
                      {teacherUsers.slice(0, 1).map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Publish coursework & materials
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Grade student GDrive submissions
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Post forum announcements & answers
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => loginAsUser(teacherUsers[0]?.id || 'usr-teacher-1')}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 group-hover:scale-[1.02]"
                  >
                    <span>Log In as Teacher</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* STUDENT CARD */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {getRoleBadge('student')}
                      <span className="text-[10px] font-mono text-blue-400">Level 3</span>
                    </div>

                    <div className="space-y-3">
                      {studentUsers.slice(0, 1).map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/40"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Submit Google Drive task links
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Access lecture PDF & video materials
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> View grades & teacher feedback
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => loginAsUser(studentUsers[0]?.id || 'usr-student-1')}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:scale-[1.02]"
                  >
                    <span>Log In as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Credentials Login Form */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="max-w-md mx-auto space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-white">Sign In with Credentials</h2>
                <p className="text-xs text-slate-400">
                  Enter your registered user email to authenticate into your account.
                </p>
              </div>

              {/* Sample Emails Quick Chips */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Select Demo Emails:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@school.edu');
                      setPassword('password123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-950 hover:text-purple-300 text-[11px] font-mono text-slate-300 border border-slate-700 transition"
                  >
                    admin@school.edu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('robert.chen@school.edu');
                      setPassword('password123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-[11px] font-mono text-slate-300 border border-slate-700 transition"
                  >
                    robert.chen@school.edu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('daniel.santos@student.edu');
                      setPassword('password123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-950 hover:text-blue-300 text-[11px] font-mono text-slate-300 border border-slate-700 transition"
                  >
                    daniel.santos@student.edu
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@school.edu"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <span className="text-[10px] text-slate-500">Demo password: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Dashboard
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-2">
          <span>GoLMS • Golang Gin REST API & GORM ORM Model</span>
          <span className="flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-cyan-500" /> Multi-tier Role Auth Enabled
          </span>
        </div>
      </div>
    </div>
  );
};
