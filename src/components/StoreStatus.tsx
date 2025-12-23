import React from 'react';
import { Clock } from 'lucide-react'; 
import { OPENING_HOUR, OPENING_MINUTE, CLOSING_HOUR, CLOSING_MINUTE } from '../constants';

interface StoreStatusProps {
  isOpen: boolean;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ isOpen }) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const openTime = `${pad(OPENING_HOUR)}:${pad(OPENING_MINUTE)}`;
  const closeTime = `${pad(CLOSING_HOUR)}:${pad(CLOSING_MINUTE)}`;

  return (
    <div className={`
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
      )}
    </div>
  );
};

export default StoreStatus;