
import React, { useState } from 'react';
import { Position, UserProfile } from '../../types';
import { firebaseService } from '../../services/firebase';
import { User, Shield, Zap, Target, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  uid: string;
  email?: string;
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ uid, email, onComplete }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('Zagueiro');
  const [submitting, setSubmitting] = useState(false);

  const positionsList: { id: Position; label: string; icon: any }[] = [
    { id: 'Goleiro', label: 'Goleiro', icon: Shield },
    { id: 'Zagueiro', label: 'Zagueiro', icon: User },
    { id: 'Meio', label: 'Meio', icon: Zap },
    { id: 'Atacante', label: 'Atacante', icon: Target }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await firebaseService.saveUserProfile({ uid, name, position, email });
      onComplete();
    } catch (error) {
      alert("Erro ao salvar perfil.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        <div className="bg-indigo-600 p-12 text-white md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-4">Complete seu Perfil</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Identifique-se para entrar nas convocações e garantir seu lugar no campo.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-12 md:w-1/2 space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome de Guerra</label>
            <input 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 font-bold"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Gaúcho"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sua Posição</label>
            <div className="grid grid-cols-2 gap-3">
              {positionsList.map(pos => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPosition(pos.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    position === pos.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 hover:bg-slate-50'
                  }`}
                >
                  <pos.icon size={18} className={position === pos.id ? 'text-indigo-600 mb-2' : 'text-slate-400 mb-2'} />
                  <p className="text-xs font-black text-slate-900">{pos.label}</p>
                </button>
              ))}
            </div>
          </div>
          <button 
            disabled={submitting}
            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {submitting ? 'Salvando...' : 'Finalizar Perfil'} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
