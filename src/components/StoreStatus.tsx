import React from 'react';
<<<<<<< HEAD
import { Clock } from 'lucide-react'; 
=======
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
import { OPENING_HOUR, OPENING_MINUTE, CLOSING_HOUR, CLOSING_MINUTE } from '../constants';

interface StoreStatusProps {
  isOpen: boolean;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ isOpen }) => {
<<<<<<< HEAD
=======
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday
  const isMonday = today === 1;

  // Formata hora/minuto com zero à esquerda se necessário (ex: 17:30)
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
  const pad = (n: number) => n.toString().padStart(2, '0');
  const openTime = `${pad(OPENING_HOUR)}:${pad(OPENING_MINUTE)}`;
  const closeTime = `${pad(CLOSING_HOUR)}:${pad(CLOSING_MINUTE)}`;

  return (
    <div className={`
<<<<<<< HEAD
      mx-auto max-w-lg mb-10 rounded-[2.5rem] border px-10 py-6 flex items-center justify-center gap-6 transition-all duration-700 shadow-sm
      ${isOpen 
        ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent' 
        : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}
    `}>
      {isOpen ? (
        <>
          <div className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-accent"></span>
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-black uppercase tracking-[0.3em]">Cozinha à Todo Vapor</p>
            <p className="text-xs font-bold opacity-60">Pedidos aceitos até às {closeTime}</p>
          </div>
        </>
      ) : (
        <>
          <Clock size={28} className="text-brand-primary" />
          <div className="flex flex-col">
            <p className="text-[11px] font-black uppercase tracking-[0.3em]">Descanso do Chef</p>
            <p className="text-xs font-bold opacity-60">Reabriremos às {openTime}</p>
          </div>
        </>
=======
      mx-auto max-w-2xl mt-6 rounded-xl shadow-sm border px-4 py-4 text-center font-bold text-sm md:text-base transition-colors duration-300
      ${isOpen 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'}
    `}>
      {isOpen ? (
        <span className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            ✅ Estamos Abertos!
          </span>
          <span className="font-normal text-sm opacity-90 hidden sm:inline">-</span>
          <span className="text-xs sm:text-sm font-normal">
            Fecha às {closeTime}h
          </span>
        </span>
      ) : (
        <span className="flex flex-col items-center justify-center gap-1">
           <span className="flex items-center gap-2">⛔ Loja Fechada</span>
           <span className="text-xs font-normal opacity-90">
             {isMonday 
               ? "Hoje (Segunda) não abrimos. Funcionamos de Terça a Domingo." 
               : `Abrimos hoje às ${openTime}h. (Terça a Domingo)`}
           </span>
        </span>
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
      )}
    </div>
  );
};

export default StoreStatus;