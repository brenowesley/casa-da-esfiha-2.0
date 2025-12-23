import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { MANAGER_CREDENTIALS } from '../constants';

<<<<<<< HEAD
interface Props {
=======
interface ManagerLoginProps {
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
  onLoginSuccess: () => void;
  onBack: () => void;
}

<<<<<<< HEAD
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
=======
const ManagerLogin: React.FC<ManagerLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === MANAGER_CREDENTIALS.username && password === MANAGER_CREDENTIALS.password) {
      onLoginSuccess();
    } else {
      setError('Credenciais incorretas.');
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="max-w-md mx-auto pt-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Acesso Gerencial</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-center mb-6 text-brand-red">
          <div className="bg-red-50 p-4 rounded-full">
            <Lock size={40} />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-red hover:bg-brand-darkRed text-white py-3.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> Entrar no Sistema
          </button>
        </form>
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
      </div>
    </div>
  );
};

export default ManagerLogin;