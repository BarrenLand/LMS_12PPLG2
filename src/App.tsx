import React from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { MaterialsView } from './components/Materials/MaterialsView';
import { ForumView } from './components/Forum/ForumView';
import { GolangExporterModal } from './components/GolangExporter/GolangExporterModal';
import { LoginScreen } from './components/Auth/LoginScreen';

const MainContent: React.FC = () => {
  const { activeTab, currentUser, isLoggedIn } = useLms();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'admin') return <AdminDashboard />;
        if (currentUser.role === 'teacher') return <TeacherDashboard />;
        return <StudentDashboard />;

      case 'users':
        return <AdminDashboard />;

      case 'materials':
        return <MaterialsView />;

      case 'tasks':
        if (currentUser.role === 'teacher') return <TeacherDashboard />;
        return <StudentDashboard />;

      case 'forum':
        return <ForumView />;

      case 'golang_code':
        return <GolangExporterModal />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500 selection:text-white pb-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderTabContent()}
      </main>
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
