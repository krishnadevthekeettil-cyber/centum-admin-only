
import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  BookOpen, 
  Trophy, 
  Bell, 
  Users, 
  FileText,
  TrendingUp,
  ArrowUpRight,
  Plus,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    news: 0,
    blogs: 0,
    results: 0,
    announcements: 0,
    subscribers: 0,
    brochures: 0,
    enquiries: 0,
    admissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const tables = ['centum_news', 'centum_blogs', 'centum_results', 'centum_announcements', 'centum_subscribers', 'centumbrosher', 'centum_enquiries', 'centum_admissions'];
      const counts = await Promise.all(
        tables.map(async (table) => {
          const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
          if (error) {
            console.error(`Error fetching count for ${table}:`, error);
            return 0;
          }
          return count || 0;
        })
      );

      setStats({
        news: counts[0],
        blogs: counts[1],
        results: counts[2],
        announcements: counts[3],
        subscribers: counts[4],
        brochures: counts[5],
        enquiries: counts[6],
        admissions: counts[7],
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'News', value: stats.news, color: '#4f46e5' },
    { name: 'Blogs', value: stats.blogs, color: '#7c3aed' },
    { name: 'Results', value: stats.results, color: '#2563eb' },
    { name: 'Alerts', value: stats.announcements, color: '#0891b2' },
    { name: 'Enquiries', value: stats.enquiries, color: '#f59e0b' },
    { name: 'Admissions', value: stats.admissions, color: '#ec4899' },
    { name: 'Users', value: stats.subscribers, color: '#059669' },
  ];

  const cards = [
    { name: 'Total News', value: stats.news, icon: Newspaper, color: 'indigo', id: 'centum_news' },
    { name: 'Total Blogs', value: stats.blogs, icon: BookOpen, color: 'violet', id: 'centum_blogs' },
    { name: 'Student Results', value: stats.results, icon: Trophy, color: 'blue', id: 'centum_results' },
    { name: 'Announcements', value: stats.announcements, icon: Bell, color: 'cyan', id: 'centum_announcements' },
    { name: 'Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'amber', id: 'centum_enquiries' },
    { name: 'Admissions', value: stats.admissions, icon: GraduationCap, color: 'pink', id: 'centum_admissions' },
    { name: 'Subscribers', value: stats.subscribers, icon: Users, color: 'emerald', id: 'centum_subscribers' },
    { name: 'Brochures', value: stats.brochures, icon: FileText, color: 'slate', id: 'centumbrosher' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Quick summary of all your Centum Academy content.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name}
              onClick={() => onNavigate(card.id)}
              className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 -mr-8 -mt-8 rounded-full blur-3xl`} />
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-500 text-sm font-medium">{card.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{card.value}</span>
                  <span className="text-slate-400 text-sm">entries</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Manage entries</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Content Distribution</h3>
            <select className="bg-slate-100 border-none text-xs rounded-lg px-2 py-1 outline-none">
              <option>All Time</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl text-white flex flex-col justify-between shadow-xl shadow-indigo-200">
          <div>
            <h3 className="text-xl font-bold mb-2">Need to update content?</h3>
            <p className="text-indigo-100/80 text-sm">Quickly add new announcements or news items directly from the dashboard.</p>
          </div>
          <div className="space-y-3 mt-8">
            <button 
              onClick={() => onNavigate('centum_announcements')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
            <button 
              onClick={() => onNavigate('centum_news')}
              className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Publish News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
