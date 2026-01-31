
import React from 'react';
import { Athlete, Position } from '../types';
import { Edit2, Trash2, UserCircle2, Shield, Zap, Target, User } from 'lucide-react';

interface AthleteListProps {
  athletes: Athlete[];
  onDelete: (id: string) => void;
  onEdit: (athlete: Athlete) => void;
}

export const AthleteList: React.FC<AthleteListProps> = ({ athletes, onDelete, onEdit }) => {
  const getPositionIcon = (pos: Position) => {
    switch(pos) {
      case 'Goleiro': return Shield;
      case 'Zagueiro': return User;
      case 'Meio': return Zap;
      case 'Atacante': return Target;
      default: return UserCircle2;
    }
  };

  const getPositionBadge = (pos: Position) => {
    const colors = {
      'Goleiro': 'bg-orange-100 text-orange-700',
      'Zagueiro': 'bg-blue-100 text-blue-700',
      'Meio': 'bg-green-100 text-green-700',
      'Atacante': 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[pos]}`}>
        {pos}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-5">Atleta</th>
              <th className="px-8 py-5">Função</th>
              <th className="px-8 py-5">Presença</th>
              <th className="px-8 py-5 text-right">Controle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {athletes.map((athlete) => {
              const Icon = getPositionIcon(athlete.position);
              return (
                <tr key={athlete.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden group-hover:scale-110 transition-transform">
                        {athlete.photoUrl ? (
                          <img src={athlete.photoUrl} alt={athlete.name} className="w-full h-full object-cover" />
                        ) : (
                          <Icon size={24} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{athlete.name}</p>
                        <p className="text-xs text-slate-400">Desde o início</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {getPositionBadge(athlete.position)}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`flex items-center gap-2 text-xs font-bold ${athlete.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${athlete.status === 'active' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-300'}`} />
                      {athlete.status === 'active' ? 'CONFIRMADO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(athlete)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(athlete.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {athletes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-slate-400 text-sm">
                  <div className="max-w-xs mx-auto">
                    <UserCircle2 size={40} className="mx-auto mb-4 opacity-20" />
                    Aguardando novos atletas entrarem na lista de convocação...
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
