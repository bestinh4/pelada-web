
import React, { useState, useEffect } from 'react';
import { Athlete, Position } from '../types';
import { X, Save, Shield, User, Zap, Target } from 'lucide-react';

interface AthleteFormProps {
  athlete?: Athlete | null;
  onSave: (athlete: Partial<Athlete>) => void;
  onClose: () => void;
}

export const AthleteForm: React.FC<AthleteFormProps> = ({ athlete, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Athlete>>({
    name: '',
    position: 'Zagueiro',
    status: 'active'
  });

  useEffect(() => {
    if (athlete) setFormData(athlete);
  }, [athlete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
  };

  const posIcons = {
    'Goleiro': Shield,
    'Zagueiro': User,
    'Meio': Zap,
    'Atacante': Target
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in duration-300">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {athlete ? 'Editar Perfil' : 'Convocação'}
            </h2>
            <p className="text-sm text-slate-500">Defina os detalhes básicos do atleta.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Nome do Craque</label>
            <input
              type="text"
              required
              placeholder="Ex: Cristiano Ronaldo"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg font-bold"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Posição Preferencial</label>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(posIcons) as Position[]).map((pos) => {
                const Icon = posIcons[pos];
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setFormData({ ...formData, position: pos })}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      formData.position === pos 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                      : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-bold text-sm">{pos}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {athlete ? 'Atualizar' : 'Finalizar Inscrição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
