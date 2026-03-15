
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  BookOpen, 
  Trophy, 
  Bell, 
  Users, 
  FileText,
  Menu,
  X,
  Search,
  Plus,
  LogOut,
  ChevronRight,
  Loader2,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { supabase } from './supabaseClient';
import Dashboard from './views/Dashboard';
import GenericManagementView from './views/GenericManagementView';
import Login from './views/Login';
import { TableName } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'News', id: 'centum_news', icon: Newspaper },
    { name: 'Blogs', id: 'centum_blogs', icon: BookOpen },
    { name: 'Results', id: 'centum_results', icon: Trophy },
    { name: 'Announcements', id: 'centum_announcements', icon: Bell },
    { name: 'Admissions', id: 'centum_admissions', icon: GraduationCap },
    { name: 'Enquiries', id: 'centum_enquiries', icon: MessageSquare },
    { name: 'Subscribers', id: 'centum_subscribers', icon: Users },
    { name: 'Brochure', id: 'centumbrosher', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={() => {}} />;
  }

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
    return <GenericManagementView tableName={activeTab as TableName} />;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 print:hidden
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Centum Admin
              </h1>
            </div>
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 text-slate-500 text-sm">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {session.user?.email?.[0].toUpperCase() || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-slate-900 truncate">{session.user?.email}</p>
                <p className="text-xs text-slate-400">Main Office</p>
              </div>
              <button onClick={handleLogout} title="Log Out">
                <LogOut className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col print:block">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
          <button 
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="capitalize font-medium text-indigo-600">
              {activeTab.replace('centum_', '').replace('centumbrosher', 'brochure')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search everything..."
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => {
                if(activeTab === 'dashboard') setActiveTab('centum_news');
              }}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
