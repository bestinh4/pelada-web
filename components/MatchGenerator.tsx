
import React, { useState } from 'react';
import { Athlete, Team } from '../types';
import { balanceTeams } from '../services/balancing';
import { Users, RefreshCw, Trophy, Info, Shield, Target, Zap, User } from 'lucide-react';

interface MatchGeneratorProps {
  athletes: Athlete[];
}

export const MatchGenerator: React.FC<MatchGeneratorProps> = ({ athletes }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [numTeams, setNumTeams] = useState(2);

  const activeAthletes = athletes.filter(a => a.status === 'active');

  const togglePlayer = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    const participants = athletes.filter(a => selectedIds.includes(a.id));
    if (participants.length < 2) return;
    const generated = balanceTeams(participants, numTeams);
    setTeams(generated);
  };

  const selectAll = () => {
    setSelectedIds(activeAthletes.map(a => a.id));
  };

  const getPosIcon = (pos: string) => {
    switch(pos) {
      case 'Goleiro': return Shield;
      case 'Atacante': return Target;
      case 'Meio': return Zap;
      default: return User;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna Esquerda: Lista de Chamada */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Users size={24} className="text-indigo-600" />
              Lista ({selectedIds.length})
            </h3>
            <button onClick={selectAll} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
              Todos Ativos
            </button>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
            {activeAthletes.length > 0 ? activeAthletes.map(athlete => {
              const Icon = getPosIcon(athlete.position);
              return (
                <label 
                  key={athlete.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedIds.includes(athlete.id) 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                    : 'border-slate-50 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedIds.includes(athlete.id)}
                    onChange={() => togglePlayer(athlete.id)}
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedIds.includes(athlete.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{athlete.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{athlete.position}</p>
                  </div>
                </label>
              );
            }) : (
              <p className="text-center py-8 text-slate-400 text-sm">Nenhum atleta ativo no sistema.</p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Número de Equipes</label>
              <div className="flex gap-3">
                {[2, 3, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => setNumTeams(n)}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                      numTeams === n ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={selectedIds.length < (numTeams * 2)}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-200"
            >
              Sortear Times
            </button>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Dashboard de Times */}
      <div className="lg:col-span-2">
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500">
            {teams.map((team, idx) => (
              <div key={team.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className={`px-10 py-8 flex items-center justify-between ${idx % 2 === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
                  <h4 className="font-black text-xl uppercase tracking-tighter flex items-center gap-3">
                    <Trophy size={20} />
                    {team.name}
                  </h4>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {team.players.length} Players
                  </div>
                </div>
                <div className="p-8 space-y-3 bg-white">
                  {team.players.map(player => {
                    const PosIcon = getPosIcon(player.position);
                    return (
                      <div key={player.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <PosIcon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{player.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{player.position}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white h-[600px] rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div className="bg-slate-50 p-10 rounded-full mb-8">
              <RefreshCw size={64} className="opacity-20" />
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Pronto para a escalação?</h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
              Selecione os craques na lista lateral. Nosso algoritmo vai garantir que cada time tenha um goleiro e equilíbrio tático nas demais posições.
            </p>
            <div className="flex items-center gap-3 text-xs bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full font-black uppercase tracking-widest">
              <Info size={16} />
              Foco em Equilíbrio por Posição
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
