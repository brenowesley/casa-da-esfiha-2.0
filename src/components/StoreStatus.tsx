import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Bed } from 'lucide-react';

interface StoreStatusProps {
  isOpen: boolean;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ isOpen }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
      
        <motion.div
          key="open"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-brand-cream rounded-[2.5rem] p-1 shadow-premium mb-8 animate-fade-up"
        >
          <div className="bg-white rounded-[2.3rem] p-6 flex items-center gap-5 border border-brand-dark/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5">
              <Store size={100} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 z-10">
              <Store size={26} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-black text-brand-dark leading-none">Loja Aberta!</h2>
              <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest mt-1">Faça seu pedido agora</p>
            </div>
          </div>
          <div className="bg-emerald-500/10 text-emerald-700 text-center py-3 rounded-b-[2.3rem] flex items-center justify-center gap-2">
             <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aceitando Pedidos</span>
          </div>
        </motion.div>
      ) : (
        
        <motion.div
          key="closed"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-brand-cream rounded-[2.5rem] p-1 shadow-premium mb-8 animate-fade-up"
        >
          <div className="bg-white rounded-[2.3rem] p-6 flex items-center gap-5 border border-brand-dark/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5">
              <Bed size={100} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center text-white shadow-lg z-10">
              <Bed size={26} />
            </div>
            <div>
              {/* NOVA MENSAGEM AQUI */}
              <h2 className="text-xl font-serif font-black text-brand-dark leading-none">Gênio Descansando</h2>
              <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest mt-1">Voltaremos em breve!</p>
            </div>
          </div>
          {/* BARRA INFERIOR COM O AVISO */}
          <div className="bg-brand-dark/5 text-brand-dark/60 text-center py-3 rounded-b-[2.3rem] flex items-center justify-center gap-2">
             <span className="text-[10px] font-black uppercase tracking-[0.1em]">
               Hoje o gênio das esfihas vai descansar 😴
             </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreStatus;
