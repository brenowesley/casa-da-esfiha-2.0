import React from 'react';
import { Product } from '../types';
<<<<<<< HEAD
import { Plus, Minus } from 'lucide-react';

interface Props {
=======
import { formatCurrency } from '../utils';
import { Plus, Minus, Ban } from 'lucide-react';

interface MenuItemProps {
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
}

<<<<<<< HEAD
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
=======
const MenuItem: React.FC<MenuItemProps> = ({ product, quantity, onUpdateQuantity }) => {
  if (!product.available) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 bg-gray-50 opacity-60 grayscale">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-gray-500 line-through decoration-gray-400">
            {product.name}
          </h3>
          <p className="text-gray-400 font-medium text-sm">Esgotado</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400 bg-gray-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
          <Ban size={14} /> Indisponível
        </div>
      </div>
    );
  }

  return (
    <div className={`
      flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors
      ${quantity > 0 ? 'bg-brand-yellow/5 border-l-4 border-l-brand-red pl-3' : ''}
    `}>
      <div className="flex-1 pr-4">
        <h3 className={`font-semibold text-gray-800 ${quantity > 0 ? 'text-brand-darkRed' : ''}`}>
          {product.name}
        </h3>
        <p className="text-brand-red font-bold">{formatCurrency(product.price)}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(product.id, -1)}
          disabled={quantity === 0}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full transition-all
            ${quantity === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-yellow text-brand-darkRed hover:bg-brand-yellowHover shadow-sm hover:scale-105 active:scale-95'}
          `}
          aria-label="Decrease quantity"
        >
          <Minus size={16} strokeWidth={3} />
        </button>

        <span className={`w-6 text-center font-bold ${quantity > 0 ? 'text-black' : 'text-gray-400'}`}>
          {quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(product.id, 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-yellow text-brand-darkRed hover:bg-brand-yellowHover shadow-sm transition-all hover:scale-105 active:scale-95"
          aria-label="Increase quantity"
        >
          <Plus size={16} strokeWidth={3} />
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
        </button>
      </div>
    </div>
  );
};

export default MenuItem;