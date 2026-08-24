import React, { useState } from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { WaliKelasDashboard } from './components/WaliKelas/WaliKelasDashboard';
import { ClassesView } from './components/Classes/ClassesView';
import { TasksView } from './components/Tasks/TasksView';
import { AttendanceHubView } from './components/Attendance/AttendanceHubView';
import { MaterialsView } from './components/Materials/MaterialsView';
import { ForumView } from './components/Forum/ForumView';
import { ScheduleView } from './components/Schedule/ScheduleView';
import { GradebookView } from './components/Gradebook/GradebookView';
import { GolangExporterModal } from './components/GolangExporter/GolangExporterModal';
import { LoginScreen } from './components/Auth/LoginScreen';
import { AutoLogoutWarningModal } from './components/Auth/AutoLogoutWarningModal';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, currentUser, isLoggedIn, sessionExtendedToast } = useLms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'admin') return <AdminDashboard />;
        if (currentUser.role === 'wali_kelas') return <WaliKelasDashboard />;
        if (currentUser.role === 'guru' || currentUser.role === 'teacher') return <TeacherDashboard />;
        return <StudentDashboard />;

      case 'classes':
        return <ClassesView />;

      case 'tasks':
        return <TasksView />;

      case 'attendance':
        return <AttendanceHubView />;

      case 'materials':
        return <MaterialsView />;

      case 'forum':
        return <ForumView />;

      case 'schedule':
        return <ScheduleView />;

      case 'gradebook':
        return <GradebookView />;

      case 'users':
        return <AdminDashboard />;

      case 'golang_code':
        return <GolangExporterModal />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200 flex flex-col">
      {/* 1. Master Top Header Bar */}
      <TopHeader onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex-1 flex">
        {/* 2. Left Smart Sidebar Navigation */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* 3. Main Content Canvas */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50/70 dark:bg-[#090d16]">
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto">
            {renderTabContent()}
          </main>

          {/* 4. Footer */}
          <footer className="px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">SMK Citra Negara</span>
              <span>•</span>
              <span>Daniel Nurindra S.Kom</span>
            </div>
            <div>
              <span>Powered by Go 1.22 REST Engine & React</span>
            </div>
          </footer>
        </div>
      </div>

      {/* 5. Inactivity Auto-Logout Warning Modal */}
      <AutoLogoutWarningModal />

      {/* 6. Session Extended Toast Notification */}
      {sessionExtendedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 text-xs font-semibold">
          <div className="p-1 rounded-full bg-white/20">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span>{sessionExtendedToast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LmsProvider>
      <MainContent />
    </LmsProvider>
  );
}
