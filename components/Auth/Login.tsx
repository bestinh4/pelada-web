
import React, { useState } from 'react';
import { firebaseService, auth } from '../../services/firebase';
import { Shield, Mail, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      if (!auth) {
        setError("Configuração do Firebase pendente. Insira uma API Key válida.");
        return;
      }
      await firebaseService.signInWithGoogle();
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/api-key-not-valid') {
        setError("A chave de API do Firebase fornecida é inválida.");
      } else {
        setError(error.message || "Falha ao realizar login.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Pelada Pro</h1>
          <p className="text-slate-400 font-medium">O próximo nível da sua resenha começa aqui.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-6 backdrop-blur-xl relative overflow-hidden">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-left animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Erro de Configuração</p>
                <p className="text-xs text-red-200/70 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-bold tracking-widest">OU</span></div>
          </div>

          <button className="w-full py-4 bg-transparent border-2 border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all opacity-50 cursor-not-allowed">
            <Mail size={20} />
            Continuar com E-mail
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Enterprise Management System v1.0
          </p>
          <p className="text-slate-600 text-[9px] max-w-xs mx-auto">
            Certifique-se de que as chaves do Firebase em <code className="text-indigo-400">services/firebase.ts</code> estão corretas.
          </p>
        </div>
      </div>
    </div>
  );
};
