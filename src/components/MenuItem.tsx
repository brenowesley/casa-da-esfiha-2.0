import React from 'react';
import { Product } from '../types';
import { Plus, Minus } from 'lucide-react';

interface Props {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const MenuItem: React.FC<Props> = ({ product, quantity, onUpdateQuantity }) => {
  return (
    <div className={`
      relative bg-white p-6 rounded-[2.5rem] flex items-center justify-between transition-all duration-300
      ${quantity > 0 ? 'ring-4 ring-brand-orange/10 shadow-2xl scale-[1.02]' : 'hover:shadow-premium border border-brand-dark/5'}
      ${!product.available ? 'opacity-60 grayscale' : ''}
    `}>
      <div className="flex-1">
        <h3 className="font-serif font-black text-brand-dark text-xl mb-1">{product.name}</h3>
        <p className="text-[10px] text-brand-dark/30 font-bold uppercase tracking-[0.2em] mb-3">Casa da Esfirra Itabuna</p>
        <span className="text-brand-orange font-black text-2xl">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </span>
      </div>

      <div className="flex items-center gap-4 bg-brand-dark/5 p-2 rounded-[1.8rem]">
        {quantity > 0 && (
          <>
            <button 
              onClick={() => onUpdateQuantity(product.id, -1)}
              className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-all"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            <span className="w-4 text-center font-black text-brand-dark">{quantity}</span>
          </>
        )}
        <button 
          disabled={!product.available}
          onClick={() => onUpdateQuantity(product.id, 1)}
          className={`w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center text-white transition-all 
            ${product.available ? 'bg-brand-orange shadow-brand-orange/20 hover:scale-110 active:scale-95' : 'bg-gray-300'}`}
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default MenuItem;