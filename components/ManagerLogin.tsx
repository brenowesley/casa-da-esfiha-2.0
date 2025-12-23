
import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { MANAGER_CREDENTIALS } from '../constants';

interface ManagerLoginProps {
  // Add missing currentPassword prop
  currentPassword: string;
  onLoginSuccess: () => void;
  onBack: () => void;
}

const ManagerLogin: React.FC<ManagerLoginProps> = ({ currentPassword, onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the dynamic currentPassword prop instead of static constant
    if (username === MANAGER_CREDENTIALS.username && password === currentPassword) {
      onLoginSuccess();
    } else {
      setError('Credenciais incorretas.');
    }
  };

  return (
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
      </div>
    </div>
  );
};

export default ManagerLogin;
