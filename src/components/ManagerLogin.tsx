import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { MANAGER_CREDENTIALS } from '../constants';
import { motion } from 'framer-motion'; // Faltava esse import!

interface ManagerLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const ManagerLogin: React.FC<ManagerLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('manager_password') || MANAGER_CREDENTIALS.password;
    if (password === savedPassword) {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-up">
        <button onClick={onBack} className="flex items-center gap-3 text-brand-dark/40 hover:text-brand-dark mb-10 font-black uppercase tracking-widest text-[10px] transition-all">
          <ArrowLeft size={16} /> Voltar ao Cardápio
        </button>

        <div className="bg-white rounded-[3.5rem] p-10 shadow-premium border border-brand-dark/5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} className="text-brand-orange" /></div>
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-brand-yellow rounded-[2rem] rotate-12 flex items-center justify-center shadow-lg shadow-brand-yellow/20">
              <Lock size={40} className="text-brand-dark -rotate-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white border-4 border-white"><ShieldCheck size={18} /></div>
          </div>
          <h2 className="text-4xl font-serif font-black text-brand-dark mb-2">Área do Gênio</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" 
              className={`w-full p-6 rounded-2xl bg-brand-dark/5 border-2 outline-none font-bold text-center text-2xl tracking-[0.5em] transition-all ${error ? 'border-red-500 bg-red-50 animate-shake' : 'border-transparent focus:border-brand-orange/30 focus:bg-white'}`} autoFocus />
            <button type="submit" className="w-full bg-brand-dark text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
              <span>Acessar Painel</span> <ShieldCheck size={18} />
            </button>
          </form>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black mt-6 uppercase tracking-widest">Senha Incorreta</motion.p>}
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;