
import React, { useState } from 'react';
import { Position, Athlete } from '../types';
import { User, Shield, Zap, Target, CheckCircle2, ArrowRight } from 'lucide-react';

interface PublicJoinProps {
  onJoin: (athlete: Partial<Athlete>) => Promise<void>;
  onViewList: () => void;
}

export const PublicJoin: React.FC<PublicJoinProps> = ({ onJoin, onViewList }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('Zagueiro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const positionsList: { id: Position; label: string; icon: any; desc: string }[] = [
    { id: 'Goleiro', label: 'Goleiro', icon: Shield, desc: 'A última barreira do time.' },
    { id: 'Zagueiro', label: 'Zagueiro', icon: User, desc: 'Segurança total na defesa.' },
    { id: 'Meio', label: 'Meio', icon: Zap, desc: 'O motor e cérebro do jogo.' },
    { id: 'Atacante', label: 'Atacante', icon: Target, desc: 'Faro de gol e velocidade.' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onJoin({ name, position, status: 'active' });
      setIsSuccess(true);
    } catch (error) {
      alert("Erro ao se cadastrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Presença Confirmada!</h2>
          <p className="text-slate-400 mb-8">Bom jogo, craque! Seu nome já está na lista para o sorteio dos times.</p>
          <button 
            onClick={onViewList}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            Ver Lista de Confirmados <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Lado Esquerdo - Info */}
        <div className="bg-indigo-600 p-8 md:p-12 text-white md:w-5/12 flex flex-col justify-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <Shield size={24} />
          </div>
          <h1 className="text-3xl font-black mb-4 leading-tight">Pelada Pro</h1>
          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            Cadastre-se agora para a próxima partida. O sorteio será automático e equilibrado por posições.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-indigo-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Inscrições Abertas
            </div>
          </div>
        </div>

        {/* Lado Direito - Form */}
        <div className="p-8 md:p-12 md:w-7/12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quem é você no campo?</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Seu Nome</label>
              <input 
                type="text"
                required
                placeholder="Ex: Neymar Jr."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Escolha sua Posição</label>
              <div className="grid grid-cols-2 gap-3">
                {positionsList.map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      position === pos.id 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' 
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <pos.icon size={20} className={position === pos.id ? 'text-indigo-600 mb-2' : 'text-slate-400 mb-2'} />
                    <p className={`text-sm font-bold ${position === pos.id ? 'text-indigo-900' : 'text-slate-700'}`}>{pos.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">{pos.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Cadastrando...' : 'Confirmar Presença'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
