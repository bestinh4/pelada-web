
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  PlusCircle, 
  Search,
  Bell,
  ArrowRight,
  UserCheck,
  Dribbble,
  Shield,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Athlete, DashboardTab } from './types';
import { firebaseService } from './services/firebase';
import { StatCard } from './components/ui/StatCard';
import { AthleteList } from './components/AthleteList';
import { AthleteForm } from './components/AthleteForm';
import { MatchGenerator } from './components/MatchGenerator';
import { Profile } from './components/Profile';
import { Login } from './components/Auth/Login';
import { Onboarding } from './components/Auth/Onboarding';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.Overview);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync from Firebase
  useEffect(() => {
    const unsubscribe = firebaseService.getAthletes((data) => {
      setAthletes(data);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Login />;
  if (!profile) return <Onboarding uid={user.uid} email={user.email || undefined} onComplete={refreshProfile} />;

  const handleSaveAthlete = async (data: Partial<Athlete>) => {
    try {
      if (editingAthlete) {
        await firebaseService.updateAthlete(editingAthlete.id, data);
      } else {
        await firebaseService.addAthlete({
          ...data,
          status: data.status || 'active'
        });
      }
      setShowForm(false);
      setEditingAthlete(null);
    } catch (error) {
      alert("Erro ao salvar atleta.");
    }
  };

  const isConfirmed = athletes.some(a => a.id === user.uid);

  const togglePresence = async () => {
    try {
      if (isConfirmed) {
        await firebaseService.removePresence(user.uid);
      } else {
        await firebaseService.confirmPresence(profile);
      }
    } catch (error) {
      alert("Erro ao confirmar presença.");
    }
  };

  const handleDeleteAthlete = async (id: string) => {
    if (window.confirm("Deseja realmente remover?")) {
      await firebaseService.deleteAthlete(id);
    }
  };

  const filteredAthletes = athletes.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: athletes.length,
    active: athletes.filter(a => a.status === 'active').length,
    goalkeepers: athletes.filter(a => a.position === 'Goleiro').length,
    others: athletes.filter(a => a.position !== 'Goleiro').length
  };

  const navItems = [
    { id: DashboardTab.Overview, label: 'Início', icon: LayoutDashboard },
    { id: DashboardTab.Athletes, label: 'Elenco', icon: Users },
    { id: DashboardTab.MatchGenerator, label: 'Sorteio', icon: Dribbble },
    { id: DashboardTab.Profile, label: 'Perfil', icon: UserIcon },
    { id: DashboardTab.Settings, label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar - Desktop Only */}
      <aside className="w-72 bg-slate-900 hidden lg:flex flex-col text-slate-400 p-8 fixed h-full z-20">
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-900/40">P</div>
          <h1 className="text-white font-black text-xl tracking-tight">Pelada Pro</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30' 
                : 'hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <item.icon size={22} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-slate-800 rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
               {profile.name.charAt(0)}
             </div>
             <div className="flex-1 truncate">
                <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">{profile.name}</p>
                <p className="text-[10px] text-slate-500 uppercase">{profile.position}</p>
             </div>
             <button onClick={() => firebaseService.logout()} className="p-2 text-slate-500 hover:text-white"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen p-6 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-slate-400 font-medium text-sm mt-1">Olá, {profile.name.split(' ')[0]}! Tudo pronto para o jogo?</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar craque..."
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-600/10 w-full md:w-64 shadow-sm text-sm font-bold"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 shadow-sm relative"><Bell size={20} /></button>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === DashboardTab.Overview && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Inscritos" value={stats.total} icon={Users} color="bg-indigo-50 text-indigo-600" />
              <StatCard label="Confirmados" value={stats.active} icon={UserCheck} color="bg-emerald-50 text-emerald-600" />
              <StatCard label="Goleiros" value={stats.goalkeepers} icon={Shield} color="bg-orange-50 text-orange-600" />
              <StatCard label="Linha" value={stats.others} icon={Dribbble} color="bg-blue-50 text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-indigo-600 p-12 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-center min-h-[400px] relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Vai pro jogo hoje?</h3>
                  <p className="text-indigo-100 text-lg font-medium mb-10 max-w-sm">Confirme sua presença agora para entrar no sorteio dos times automaticamente.</p>
                  <button 
                    onClick={togglePresence}
                    className={`px-10 py-5 font-black rounded-2xl transition-all flex items-center gap-3 shadow-2xl ${
                      isConfirmed 
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                      : 'bg-white text-indigo-600 hover:bg-slate-100 shadow-white/20'
                    }`}
                  >
                    {isConfirmed ? <XCircle size={22} /> : <CheckCircle2 size={22} />}
                    {isConfirmed ? 'CANCELAR MINHA PRESENÇA' : 'CONFIRMAR MINHA PRESENÇA'}
                  </button>
                </div>
                <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12 scale-150">
                  <Dribbble size={400} />
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-6">
                  <UserCheck size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">Presença Confirmada</h4>
                <p className="text-slate-400 text-sm mb-8">No momento temos <b>{stats.active} craques</b> confirmados para a próxima pelada.</p>
                <button 
                  onClick={() => setActiveTab(DashboardTab.Athletes)}
                  className="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                >
                  VER LISTA COMPLETA
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === DashboardTab.Athletes && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <AthleteList athletes={filteredAthletes} onDelete={handleDeleteAthlete} onEdit={(a) => { setEditingAthlete(a); setShowForm(true); }} />
          </div>
        )}

        {activeTab === DashboardTab.MatchGenerator && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <MatchGenerator athletes={athletes} />
          </div>
        )}

        {activeTab === DashboardTab.Profile && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <Profile profile={profile} onUpdate={refreshProfile} />
          </div>
        )}

        {activeTab === DashboardTab.Settings && (
          <div className="bg-white p-24 rounded-[3rem] text-center border border-slate-100 max-w-2xl mx-auto">
            <Settings size={48} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">Módulo de Administração</h3>
            <p className="text-slate-500 font-medium mb-8">Gerencie permissões e configurações globais da sua organização.</p>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-around items-center z-30">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? 'text-indigo-600' : 'text-slate-300'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[9px] font-black uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
