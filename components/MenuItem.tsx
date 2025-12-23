import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { Plus, Minus, Ban, Sparkles } from 'lucide-react';

interface MenuItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ product, quantity, onUpdateQuantity }) => {
  const isPremium = product.category.includes('Premium');
  const isSelected = quantity > 0;

  if (!product.available) {
    return (
      <div className="flex items-center justify-between p-7 bg-slate-100/50 rounded-[2.5rem] border border-slate-200/50 opacity-40 grayscale transition-all">
        <div className="flex-1">
          <h3 className="font-bold text-slate-500 line-through text-lg">{product.name}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Esgotado</p>
        </div>
        <div className="bg-slate-200 text-slate-400 p-3 rounded-2xl">
          <Ban size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className={`
      flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-500 group
      ${isSelected 
        ? 'bg-white border-brand-maroon shadow-premium scale-[1.02]' 
        : 'bg-white border-brand-gold/10 hover:border-brand-gold/30 shadow-sm'}
    `}>
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1.5">
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[8px] font-black uppercase tracking-tighter">
              <Sparkles size={10} /> Especial
            </div>
          )}
          <h3 className={`text-xl font-bold tracking-tight transition-colors ${isSelected ? 'text-brand-maroon' : 'text-slate-800'}`}>
            {product.name}
          </h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-brand-gold font-black text-2xl tracking-tighter">{formatCurrency(product.price)}</span>
        </div>
      </div>

      <div className={`
        flex items-center gap-4 p-1.5 rounded-2xl transition-all duration-300
        ${isSelected ? 'bg-brand-cream border border-brand-maroon/20' : 'bg-brand-cream border border-brand-gold/5'}
      `}>
        <button
          onClick={() => onUpdateQuantity(product.id, -1)}
          disabled={quantity === 0}
          className={`
            w-11 h-11 flex items-center justify-center rounded-xl transition-all
            ${quantity === 0 
              ? 'text-slate-200' 
              : 'bg-white text-brand-maroon shadow-sm active:scale-90 hover:bg-brand-maroon hover:text-white'}
          `}
        >
          <Minus size={22} strokeWidth={3} />
        </button>

        <span className={`w-6 text-center font-black text-xl ${isSelected ? 'text-brand-maroon' : 'text-slate-300'}`}>
          {quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-brand-maroon text-brand-cream shadow-lg active:scale-90 transition-all hover:bg-brand-dark"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default MenuItem;