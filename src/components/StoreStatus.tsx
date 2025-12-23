import React, { useMemo } from 'react';
import { Clock, AlertCircle, CheckCircle2, Moon } from 'lucide-react';
import { OPENING_HOUR, OPENING_MINUTE, CLOSING_HOUR, CLOSING_MINUTE } from '../constants';

interface StoreStatusProps {
  isOpen: boolean;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ isOpen }) => {
  // 1. Lógica isolada para não poluir o JSX
  const today = new Date().getDay(); 
  const isMonday = today === 1;

  // 2. Memoização para performance (evita re-processar strings em cada render)
  const times = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      open: `${pad(OPENING_HOUR)}:${pad(OPENING_MINUTE)}`,
      close: `${pad(CLOSING_HOUR)}:${pad(CLOSING_MINUTE)}`
    };
  }, []);

  return (
    <div className={`
      mx-auto max-w-2xl mt-4 rounded-[2rem] border transition-all duration-500 overflow-hidden
      ${isOpen 
        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900 shadow-sm shadow-emerald-100/50' 
        : 'bg-brand-dark/5 border-brand-dark/10 text-brand-dark/60'}
    `}>
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Lado Esquerdo: Status Principal */}
        <div className="flex items-center gap-3">
          {isOpen ? (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200">
               <CheckCircle2 size={20} className="text-white" />
               <span className="animate-ping absolute inset-0 rounded-2xl bg-emerald-400 opacity-40"></span>
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-brand-dark/10">
               <Moon size={20} className="text-brand-dark/40" />
            </div>
          )}

          <div className="text-center sm:text-left">
            <p className={`text-sm font-black uppercase tracking-widest ${isOpen ? 'text-emerald-600' : 'text-brand-dark/40'}`}>
              {isOpen ? 'Estamos Abertos!' : 'Loja Fechada'}
            </p>
            <p className="text-[11px] font-bold opacity-60">
              {isOpen 
                ? `Garanta sua esfirra até às ${times.close}h` 
                : isMonday 
                  ? 'Segunda é dia de descanso do Gênio' 
                  : `Reabriremos hoje às ${times.open}h`}
            </p>
          </div>
        </div>

        {/* Lado Direito: Badge de Horário */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter border
          ${isOpen 
            ? 'bg-white/60 border-emerald-200 text-emerald-700' 
            : 'bg-brand-dark/5 border-brand-dark/10 text-brand-dark/40'}
        `}>
          <Clock size={12} strokeWidth={3} />
          {isMonday ? 'Ter a Dom' : `${times.open} às ${times.close}`}
        </div>

      </div>

      {/* 3. Rodapé informativo sutil se estiver fechado */}
      {!isOpen && !isMonday && (
        <div className="bg-brand-orange/10 px-6 py-2 flex items-center justify-center gap-2 border-t border-brand-orange/5">
           <AlertCircle size={12} className="text-brand-orange" />
           <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
             Você pode navegar e montar seu carrinho agora!
           </span>
        </div>
      )}
    </div>
  );
};

export default StoreStatus;