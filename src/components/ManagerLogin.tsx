import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { MANAGER_CREDENTIALS } from '../constants';

interface Props {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const ManagerLogin: React.FC<Props> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verifica contra a senha no localStorage ou a constante
    const savedPassword = localStorage.getItem('manager_password') || MANAGER_CREDENTIALS.password;
    
    if (password === savedPassword) {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-dark/40 hover:text-brand-dark mb-8 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Voltar ao Cardápio
        </button>

        <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-brand-dark/5 text-center">
          <div className="w-20 h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
            <Lock size={32} />
          </div>
          
          <h2 className="text-3xl font-serif font-black text-brand-dark mb-2">Área do Gênio</h2>
          <p className="text-sm text-brand-dark/40 mb-8 font-bold uppercase tracking-widest">Acesso Restrito</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha mestra"
                className={`w-full p-5 rounded-2xl bg-brand-dark/5 border-2 outline-none font-bold text-center transition-all ${
                  error ? 'border-red-500 animate-shake' : 'border-transparent focus:border-brand-orange/20'
                }`}
                autoFocus
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} /> Entrar no Painel
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-xs font-black mt-4 uppercase tracking-widest">Senha Incorreta</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;