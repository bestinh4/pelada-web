
import React, { useState } from 'react';
import { UserProfile, Position } from '../types';
import { firebaseService } from '../services/firebase';
import { Shield, User, Zap, Target, Save, LogOut } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
  const [name, setName] = useState(profile.name);
  const [position, setPosition] = useState<Position>(profile.position);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await firebaseService.saveUserProfile({ ...profile, name, position });
    onUpdate();
    setSaving(false);
    alert("Perfil atualizado!");
  };

  const posIcons = {
    'Goleiro': Shield,
    'Zagueiro': User,
    'Meio': Zap,
    'Atacante': Target
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-12 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Meu Perfil</h2>
          <button 
            onClick={() => firebaseService.logout()}
            className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome de Craque</label>
            <input 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-600/10"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Posição Fixa</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.keys(posIcons) as Position[]).map(pos => {
                const Icon = posIcons[pos];
                return (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      position === pos ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-50 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={24} className="mb-2" />
                    <span className="text-xs font-black uppercase tracking-tighter">{pos}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
        >
          <Save size={20} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};
