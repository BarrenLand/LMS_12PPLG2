import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { ThemeToggle } from '../ThemeToggle';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  School,
  LogIn,
  Search,
  Globe,
  Play,
  ArrowRight,
  Clock,
  Timer,
  BookOpen,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Layers,
  Menu,
  ChevronRight,
  X,
  Mail,
  Lock,
  Compass,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { users, login, loginAsUser, classes, sessionNotice, setSessionNotice } = useLms();

  const [activeTab, setActiveTab] = useState<'cornerstone' | 'credentials'>('cornerstone');
  const [selectedMockRole, setSelectedMockRole] = useState<'murid' | 'guru' | 'wali_kelas' | 'admin'>('murid');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Credentials Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter users by role
  const adminUsers = users.filter((u) => u.role === 'admin');
  const guruUsers = users.filter((u) => u.role === 'guru' || u.role === 'teacher');
  const waliKelasUsers = users.filter((u) => u.role === 'wali_kelas');
  const muridUsers = users.filter((u) => u.role === 'murid' || u.role === 'student');

  const activeUser =
    selectedMockRole === 'murid'
      ? muridUsers[0]
      : selectedMockRole === 'guru'
      ? guruUsers[0]
      : selectedMockRole === 'wali_kelas'
      ? waliKelasUsers[0]
      : adminUsers[0];

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
      setSuccessMessage('Login successful! Redirecting...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4fbf7] via-white to-[#edf8f2] dark:from-[#091a16] dark:via-[#0b1715] dark:to-[#091714] text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white flex flex-col transition-colors duration-200">
      {/* 1. Cornerstone-Style Clean Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#091a16]/95 backdrop-blur-md border-b border-emerald-100/80 dark:border-[#132d26] shadow-[0_2px_15px_-3px_rgba(6,78,59,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064e3b] via-[#059669] to-[#34d399] flex items-center justify-center text-white shadow-md shadow-emerald-900/15">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-2xl font-black tracking-tight text-[#064e3b] dark:text-white">
                    cornerstone
                  </span>
                  <span className="text-2xl font-light text-[#10b981] ml-0.5">lms</span>
                </div>
                <p className="text-[10px] tracking-widest text-[#059669] dark:text-[#34d399] font-semibold uppercase -mt-1 font-serif italic">
                  realize your potential
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-700 dark:text-slate-200">
            <button
              onClick={() => setActiveTab('cornerstone')}
              className={`transition hover:text-[#059669] dark:hover:text-[#34d399] ${
                activeTab === 'cornerstone' ? 'text-[#064e3b] dark:text-white font-bold border-b-2 border-[#10b981] pb-1' : ''
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('cornerstone')}
              className="hover:text-[#059669] dark:hover:text-[#34d399] transition"
            >
              Solutions
            </button>
            <button
              onClick={() => setActiveTab('cornerstone')}
              className="hover:text-[#059669] dark:hover:text-[#34d399] transition"
            >
              Why Cornerstone
            </button>
            <button
              onClick={() => setActiveTab('cornerstone')}
              className="hover:text-[#059669] dark:hover:text-[#34d399] transition"
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab('cornerstone')}
              className="hover:text-[#059669] dark:hover:text-[#34d399] transition"
            >
              Company
            </button>
          </nav>

          {/* Right Header Actions: Theme Toggle, Search, Globe & Get Demo Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <button
              title="Search"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#064e3b] dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-[#122c26] rounded-full transition"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              title="Language"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#064e3b] dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-[#122c26] rounded-full transition"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveTab('cornerstone');
                loginAsUser(guruUsers[0]?.id || 'usr-teacher-1');
              }}
              className="px-5 py-2.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
            >
              get demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 w-full">
        {/* Tab Toggle Switcher (Cornerstone Hero Showcase vs. Direct Login) */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1 bg-emerald-100/60 rounded-full border border-emerald-200/80 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('cornerstone');
                setErrorMessage(null);
              }}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'cornerstone'
                  ? 'bg-[#064e3b] text-white shadow-sm'
                  : 'text-[#064e3b] hover:text-[#059669]'
              }`}
            >
              Cornerstone Showcase & 1-Click Launch
            </button>
            <button
              onClick={() => {
                setActiveTab('credentials');
                setErrorMessage(null);
              }}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'credentials'
                  ? 'bg-[#064e3b] text-white shadow-sm'
                  : 'text-[#064e3b] hover:text-[#059669]'
              }`}
            >
              User Credentials Sign-In
            </button>
          </div>
        </div>

        {/* FEEDBACK & AUTO-LOGOUT NOTICES */}
        {sessionNotice && (
          <div className="mb-8 max-w-xl mx-auto p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-amber-950 dark:text-amber-100">
                  Sesi Berakhir (Auto-Logout)
                </div>
                <div className="text-amber-800 dark:text-amber-300 mt-0.5">{sessionNotice}</div>
              </div>
            </div>
            <button
              onClick={() => setSessionNotice(null)}
              className="p-1.5 rounded-lg text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-amber-900/50 transition shrink-0"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 max-w-xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: CORNERSTONE HERO & TABLET SHOWCASE (Identical Layout in 3 Shades of Green) */}
        {activeTab === 'cornerstone' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT COLUMN: Hero Pitch & Role Switchers */}
            <div className="lg:col-span-5 space-y-6">
              {/* Isometric 3D Graduation Cap Badge in Green Shades */}
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 relative">
                  {/* Isometric diamond / rhombus container in 3 green shades */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#064e3b] via-[#10b981] to-[#6ee7b7] rounded-3xl transform -rotate-12 shadow-xl shadow-emerald-900/15 flex items-center justify-center border-4 border-white">
                    <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md" />
                  </div>
                  {/* Decorative corner accent */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#34d399] border-2 border-white shadow flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#064e3b]" />
                  </div>
                </div>
              </div>

              {/* Display Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-[#064e3b] tracking-tight leading-[1.12]">
                  The #1 learning <br />
                  <span className="text-[#059669]">solution</span>
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md">
                  Ensure your people keep building skills with the world's best learning management system.
                </p>
              </div>

              {/* Action Buttons: Solid Emerald Pill & Dark Pill with Play Icon */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                  className="px-7 py-3.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>get demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="px-6 py-3.5 rounded-full bg-[#064e3b] hover:bg-[#043327] text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>view video</span>
                </button>
              </div>

              {/* 4 Interactive Persona Switchers (In 3 shades of green) */}
              <div className="pt-6 border-t border-emerald-100">
                <p className="text-xs font-bold text-[#064e3b] uppercase tracking-wider mb-3">
                  1-Click Role Exploration:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Murid / Student */}
                  <button
                    onClick={() => {
                      setSelectedMockRole('murid');
                      loginAsUser(muridUsers[0]?.id || 'usr-student-1');
                    }}
                    className="p-3 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-left transition shadow-sm hover:shadow-md hover:border-[#10b981] group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#34d399]/30 text-[#064e3b] flex items-center justify-center mb-1.5 group-hover:bg-[#10b981] group-hover:text-white transition">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#064e3b]">Murid</div>
                    <div className="text-[10px] text-slate-500">Student Portal</div>
                  </button>

                  {/* Guru / Teacher */}
                  <button
                    onClick={() => {
                      setSelectedMockRole('guru');
                      loginAsUser(guruUsers[0]?.id || 'usr-teacher-1');
                    }}
                    className="p-3 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-left transition shadow-sm hover:shadow-md hover:border-[#10b981] group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#10b981]/20 text-[#059669] flex items-center justify-center mb-1.5 group-hover:bg-[#059669] group-hover:text-white transition">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#064e3b]">Guru</div>
                    <div className="text-[10px] text-slate-500">Teacher Suite</div>
                  </button>

                  {/* Wali Kelas */}
                  <button
                    onClick={() => {
                      setSelectedMockRole('wali_kelas');
                      loginAsUser(waliKelasUsers[0]?.id || 'usr-walikelas-1');
                    }}
                    className="p-3 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-left transition shadow-sm hover:shadow-md hover:border-[#10b981] group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#064e3b]/10 text-[#064e3b] flex items-center justify-center mb-1.5 group-hover:bg-[#064e3b] group-hover:text-white transition">
                      <School className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#064e3b]">Wali Kelas</div>
                    <div className="text-[10px] text-slate-500">Homeroom</div>
                  </button>

                  {/* Admin */}
                  <button
                    onClick={() => {
                      setSelectedMockRole('admin');
                      loginAsUser(adminUsers[0]?.id || 'usr-admin-1');
                    }}
                    className="p-3 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 text-left transition shadow-sm hover:shadow-md hover:border-[#10b981] group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#064e3b] text-white flex items-center justify-center mb-1.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#064e3b]">Admin</div>
                    <div className="text-[10px] text-slate-500">System Admin</div>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The Tablet LMS Canvas Mockup in 3 Shades of Green */}
            <div className="lg:col-span-7">
              <div className="relative group">
                {/* Background Shadow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#064e3b]/20 via-[#10b981]/20 to-[#34d399]/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>

                {/* THE TABLET / PORTAL CONTAINER */}
                <div className="relative rounded-3xl bg-white border border-emerald-200 shadow-2xl overflow-hidden transform transition duration-500 hover:scale-[1.01]">
                  {/* Shade 1: Deep Pine Green Header Bar with Brand ACME / GOLMS */}
                  <div className="bg-[#064e3b] text-white px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold tracking-wider text-sm sm:text-base text-white">
                        ACME <span className="font-light text-[#34d399]">LMS</span>
                      </span>
                    </div>

                    {/* Search Bar & Menu Icons in Header */}
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center bg-white/15 rounded-full px-3 py-1 text-xs border border-white/20 text-white w-48">
                        <Search className="w-3.5 h-3.5 text-emerald-200 mr-2" />
                        <span className="text-emerald-100/70 text-[11px]">Search courses...</span>
                      </div>
                      <button
                        onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                        className="p-1 hover:bg-white/10 rounded-lg transition"
                      >
                        <Menu className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Tablet Body: Split Left Profile + Main Learner Area */}
                  <div className="grid grid-cols-1 md:grid-cols-12 bg-[#fafffd]">
                    {/* Left Column: Profile Card & Schedule Bars in 3 Green Shades */}
                    <div className="md:col-span-4 p-4 border-r border-emerald-100 bg-white/70 space-y-4">
                      {/* User Profile Header */}
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            activeUser?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt="User avatar"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#10b981] shadow-sm"
                        />
                        <div>
                          <p className="text-xs font-black text-[#064e3b] uppercase tracking-wide">
                            {activeUser?.name || 'LEE MURRAY'}
                          </p>
                          <p className="text-[10px] font-semibold text-[#059669] capitalize">
                            {activeUser?.role === 'murid'
                              ? 'Active Learner'
                              : activeUser?.role === 'guru'
                              ? 'Senior Instructor'
                              : activeUser?.role === 'wali_kelas'
                              ? 'Homeroom Mentor'
                              : 'System Administrator'}
                          </p>
                        </div>
                      </div>

                      {/* Status Icon Row */}
                      <div className="flex items-center justify-around py-2 border-y border-emerald-100 text-slate-500">
                        <button
                          title="Attendance"
                          onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                          className="hover:text-[#059669] transition"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          title="Profile"
                          onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                          className="hover:text-[#059669] transition"
                        >
                          <GraduationCap className="w-4 h-4" />
                        </button>
                        <button
                          title="Timer / Tasks"
                          onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                          className="hover:text-[#059669] transition"
                        >
                          <Timer className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Schedule Summary with 3-Shade Green Colored Status Ribbons */}
                      <div className="space-y-2.5">
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-sm space-y-1">
                          {/* Shade 1: Deep Pine Ribbon */}
                          <div className="w-full h-1.5 rounded-full bg-[#064e3b]"></div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-700">Golang API Core</span>
                            <span className="font-mono text-[#059669] font-semibold">09:00 AM</span>
                          </div>
                          <div className="w-3/4 h-2 bg-slate-100 rounded-sm"></div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-sm space-y-1">
                          {/* Shade 2: Vibrant Emerald Ribbon */}
                          <div className="w-full h-1.5 rounded-full bg-[#10b981]"></div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-700">Database Indexing</span>
                            <span className="font-mono text-[#059669] font-semibold">01:30 PM</span>
                          </div>
                          <div className="w-1/2 h-2 bg-slate-100 rounded-sm"></div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-sm space-y-1">
                          {/* Shade 3: Sage Mint Ribbon */}
                          <div className="w-full h-1.5 rounded-full bg-[#34d399]"></div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-700">UI/UX Systems</span>
                            <span className="font-mono text-[#059669] font-semibold">03:45 PM</span>
                          </div>
                          <div className="w-2/3 h-2 bg-slate-100 rounded-sm"></div>
                        </div>
                      </div>

                      <button
                        onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                        className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-[#10b981] text-[#064e3b] hover:text-white font-bold text-xs transition border border-emerald-200 flex items-center justify-center gap-1"
                      >
                        <span>Open Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Right Main Area: Learner Home + Playlists + Course Cards */}
                    <div className="md:col-span-8 p-4 space-y-4">
                      {/* Top Banner: "LEE'S LEARNER HOME" with lush Green Landscape Illustration */}
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#e0f7eb] to-[#d1fae5] border border-emerald-200 p-5 shadow-sm">
                        {/* Landscape Illustration Background Elements */}
                        <div className="absolute inset-0 pointer-events-none opacity-40">
                          {/* Sun & Clouds */}
                          <div className="absolute top-2 right-12 w-6 h-6 rounded-full bg-[#34d399]/40"></div>
                          {/* Rolling Green Hills in 3 shades */}
                          <div className="absolute -bottom-6 -left-10 w-64 h-24 rounded-full bg-[#6ee7b7]/60"></div>
                          <div className="absolute -bottom-8 right-0 w-80 h-28 rounded-full bg-[#10b981]/40"></div>
                          <div className="absolute -bottom-10 left-20 w-72 h-28 rounded-full bg-[#064e3b]/30"></div>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                          <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-[#064e3b] uppercase tracking-wider">
                              {activeUser?.name.split(' ')[0] || "LEE"}'S LEARNER HOME
                            </h3>
                            <p className="text-[11px] text-[#065f46]">
                              Track progress, submit assignments & achieve badges.
                            </p>
                          </div>
                          <button
                            onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#064e3b] hover:bg-[#059669] text-white text-xs font-extrabold tracking-wide uppercase transition shadow"
                          >
                            <Plus className="w-3.5 h-3.5" /> + ADD SUBJECTS
                          </button>
                        </div>
                      </div>

                      {/* Section: MY PLAYLISTS (3 Cards with green header accents) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-[#064e3b] uppercase tracking-wider">
                            MY PLAYLISTS
                          </span>
                          <span className="text-[10px] font-semibold text-[#059669]">
                            {classes.length} Enrolled Courses
                          </span>
                        </div>

                        {/* 3 Cards Matching the Screenshot: Digitally Fit, Advanced Design, Leadership 101 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Card 1: Shade 1 Deep Forest Header */}
                          <div
                            onClick={() => loginAsUser(muridUsers[0]?.id || 'usr-student-1')}
                            className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                          >
                            <div className="h-10 bg-[#064e3b] p-2 flex items-center justify-between text-white">
                              <span className="text-[10px] font-mono font-bold">DIGITAL</span>
                              <Sparkles className="w-3.5 h-3.5 text-[#34d399]" />
                            </div>
                            <div className="p-2.5 space-y-1">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-[#059669] transition line-clamp-1">
                                Are you Digitally Fit?
                              </p>
                              <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#064e3b] h-full w-3/4"></div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Shade 2 Vibrant Emerald Header */}
                          <div
                            onClick={() => loginAsUser(muridUsers[0]?.id || 'usr-student-1')}
                            className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                          >
                            <div className="h-10 bg-[#10b981] p-2 flex items-center justify-between text-white">
                              <span className="text-[10px] font-mono font-bold">DESIGN</span>
                              <BookOpen className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="p-2.5 space-y-1">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-[#059669] transition line-clamp-1">
                                Advanced Design
                              </p>
                              <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#10b981] h-full w-4/5"></div>
                              </div>
                            </div>
                          </div>

                          {/* Card 3: Shade 3 Sage Mint Header */}
                          <div
                            onClick={() => loginAsUser(muridUsers[0]?.id || 'usr-student-1')}
                            className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                          >
                            <div className="h-10 bg-[#34d399] p-2 flex items-center justify-between text-[#064e3b]">
                              <span className="text-[10px] font-mono font-bold">LEAD</span>
                              <GraduationCap className="w-3.5 h-3.5 text-[#064e3b]" />
                            </div>
                            <div className="p-2.5 space-y-1">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-[#059669] transition line-clamp-1">
                                Leadership 101
                              </p>
                              <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#34d399] h-full w-2/3"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lower 3 Course Status Blocks in 3 distinct shades of green */}
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        {/* Block 1: Deep Pine Green Block */}
                        <div
                          onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                          className="bg-[#064e3b] text-white p-3 rounded-xl shadow-sm cursor-pointer hover:opacity-95 transition"
                        >
                          <div className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold">
                            Module 1
                          </div>
                          <div className="text-xs font-bold mt-0.5">Golang Architecture</div>
                          <div className="mt-2 text-[10px] text-emerald-100/90 flex items-center justify-between">
                            <span>Progress</span>
                            <span className="font-mono font-bold">88%</span>
                          </div>
                        </div>

                        {/* Block 2: Vibrant Emerald Green Block */}
                        <div
                          onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                          className="bg-[#10b981] text-white p-3 rounded-xl shadow-sm cursor-pointer hover:opacity-95 transition"
                        >
                          <div className="text-[9px] uppercase tracking-wider text-emerald-100 font-bold">
                            Module 2
                          </div>
                          <div className="text-xs font-bold mt-0.5">Database Querying</div>
                          <div className="mt-2 text-[10px] text-emerald-100 flex items-center justify-between">
                            <span>Progress</span>
                            <span className="font-mono font-bold">92%</span>
                          </div>
                        </div>

                        {/* Block 3: Soft Sage Green Block */}
                        <div
                          onClick={() => loginAsUser(activeUser?.id || 'usr-student-1')}
                          className="bg-[#6ee7b7] text-[#064e3b] p-3 rounded-xl shadow-sm cursor-pointer hover:opacity-95 transition"
                        >
                          <div className="text-[9px] uppercase tracking-wider text-[#064e3b] font-bold">
                            Module 3
                          </div>
                          <div className="text-xs font-bold mt-0.5">REST API Services</div>
                          <div className="mt-2 text-[10px] text-[#064e3b] font-semibold flex items-center justify-between">
                            <span>Progress</span>
                            <span className="font-mono font-bold">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIALS SIGN-IN (Styled in the 3 Shades of Green) */}
        {activeTab === 'credentials' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-emerald-100 p-8 shadow-xl">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center mx-auto shadow-md">
                <LogIn className="w-6 h-6 text-[#34d399]" />
              </div>
              <h2 className="text-xl font-black text-[#064e3b]">Sign In with Email</h2>
              <p className="text-xs text-slate-500">
                Authenticate with your registered account credentials.
              </p>
            </div>

            {/* Quick Demo Credentials */}
            <div className="mb-5 space-y-1.5">
              <label className="text-[11px] font-bold text-[#064e3b] uppercase tracking-wider">
                Quick Select Demo Users:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('daniel.santos@student.edu');
                    setPassword('password123');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[11px] font-medium text-[#064e3b] border border-emerald-200 transition text-left"
                >
                  <span className="font-bold block">Murid (Student)</span>
                  <span className="text-[10px] text-slate-500 font-mono">daniel.santos@...</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('robert.chen@school.edu');
                    setPassword('password123');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[11px] font-medium text-[#064e3b] border border-emerald-200 transition text-left"
                >
                  <span className="font-bold block">Guru (Teacher)</span>
                  <span className="text-[10px] text-slate-500 font-mono">robert.chen@...</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('budi.santoso@school.edu');
                    setPassword('password123');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[11px] font-medium text-[#064e3b] border border-emerald-200 transition text-left"
                >
                  <span className="font-bold block">Wali Kelas</span>
                  <span className="text-[10px] text-slate-500 font-mono">budi.santoso@...</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@school.edu');
                    setPassword('password123');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[11px] font-medium text-[#064e3b] border border-emerald-200 transition text-left"
                >
                  <span className="font-bold block">Admin</span>
                  <span className="text-[10px] text-slate-500 font-mono">admin@school.edu</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[10px] text-slate-400">Default: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-50 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Learning Portal</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Feature Walkthrough Modal when clicking "view video" */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2 text-[#064e3b] font-bold">
                <Play className="w-4 h-4 text-[#10b981] fill-[#10b981]" />
                <span>Cornerstone LMS Platform Tour</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#064e3b] p-6 text-white text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#34d399]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">Interactive System Ready</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Experience full role permissions: Admin placement, Guru scoring & attendance, Wali Kelas monitoring, and Murid Google Drive task submission.
              </p>
            </div>

            <button
              onClick={() => {
                setShowVideoModal(false);
                loginAsUser(muridUsers[0]?.id || 'usr-student-1');
              }}
              className="w-full py-3 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs shadow-md transition"
            >
              Launch Live App Demo
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#064e3b]">cornerstone LMS</span>
            <span>• 3-Shade Green Learning Design System</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#059669] font-medium">Golang Backend + Mongoose Ready</span>
            <span>© 2026 Cornerstone Learning. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

