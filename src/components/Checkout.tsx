import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, User, CreditCard, Store, 
  Banknote, QrCode, Truck, Home, MessageCircle
} from 'lucide-react';
import { CartItem, CustomerData, PaymentMethod } from '../types';
import { formatCurrency, generateWhatsAppMessage, getDeliveryFee } from '../utils';

interface CheckoutProps {
  cart: CartItem[];
  subtotal: number;
  isStoreOpen: boolean;
  storeConfig: { delivery: boolean; pickup: boolean };
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, subtotal, isStoreOpen, storeConfig, onBack }) => {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    deliveryType: storeConfig.pickup ? 'pickup' : 'delivery',
    bairro: '', rua: '', numero: '', complemento: '', referencia: '',
    paymentMethod: 'Pix',
    changeFor: '',
    observation: ''
  });

  const isEmpty = cart.length === 0;

  useEffect(() => {
    const saved = localStorage.getItem('customerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, name: parsed.name || '' }));
      } catch (e) { console.error(e); }
    }
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deliveryFee = useMemo(() => {
    if (formData.deliveryType === 'pickup') return 0;
    return getDeliveryFee(formData.bairro);
  }, [formData.deliveryType, formData.bairro]);

  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Por favor, informe seu nome.");
    
    localStorage.setItem('customerData', JSON.stringify({ name: formData.name }));
    const link = generateWhatsAppMessage(cart, formData, subtotal, deliveryFee, total, isStoreOpen);
    window.open(link, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-48 bg-brand-cream min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 py-8 mb-4">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-brand-dark/10 text-brand-dark shadow-sm active:scale-90 transition-all">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-3xl font-serif font-black text-brand-dark tracking-tight leading-none text-center">Finalizar</h2>
      </div>

      <div className="space-y-6">
        {/* SELETOR DE ENTREGA */}
        <div className="bg-brand-dark/5 p-1.5 rounded-[2rem] flex gap-1 border border-brand-dark/5">
          {storeConfig.pickup && (
            <button type="button" onClick={() => setFormData(p => ({...p, deliveryType: 'pickup'}))}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${formData.deliveryType === 'pickup' ? 'bg-white text-brand-dark shadow-md' : 'text-brand-dark/40'}`}>
              <Store size={16} /> Retirada
            </button>
          )}
          {storeConfig.delivery && (
            <button type="button" onClick={() => setFormData(p => ({...p, deliveryType: 'delivery'}))}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${formData.deliveryType === 'delivery' ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-dark/40'}`}>
              <Truck size={16} /> Delivery
            </button>
          )}
        </div>

        {/* CARD DE TOTAL */}
        <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-brand-dark/5">
          <div className="flex justify-between items-center text-brand-dark/40 font-bold text-[11px] uppercase tracking-widest mb-4 italic">
              <span>Subtotal: {formatCurrency(subtotal)}</span>
              {formData.deliveryType === 'delivery' && <span>Entrega: {deliveryFee > 0 ? formatCurrency(deliveryFee) : 'A combinar'}</span>}
          </div>
          <div className="pt-4 border-t-2 border-dashed border-brand-dark/5 flex justify-between items-center">
              <span className="text-xl font-serif font-black text-brand-dark italic">Total</span>
              <span className="text-4xl font-serif font-black text-brand-dark tracking-tighter">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* IDENTIFICAÇÃO (Usa o ícone USER) */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-brand-dark/5 space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-orange" size={20} />
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Seu Nome Completo" 
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-brand-dark/5 border-none outline-none font-bold text-brand-dark focus:ring-2 focus:ring-brand-orange/20 transition-all" />
          </div>

          {/* ENDEREÇO (Usa o ícone HOME) */}
          {formData.deliveryType === 'delivery' && (
            <div className="space-y-4 pt-4 border-t border-brand-dark/5 animate-fade-up">
              <div className="relative">
                <Home className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
                <input type="text" name="rua" value={formData.rua} onChange={handleChange} placeholder="Rua / Logradouro" 
                  className="w-full pl-14 pr-6 py-4 rounded-xl bg-brand-dark/5 outline-none font-bold text-brand-dark" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} placeholder="Nº" className="px-6 py-4 rounded-xl bg-brand-dark/5 outline-none font-bold text-brand-dark" />
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" className="px-6 py-4 rounded-xl bg-brand-dark/5 outline-none font-bold text-brand-dark" />
              </div>
            </div>
          )}
        </section>

        {/* PAGAMENTO (Usa os ícones QRCODE, CREDITCARD e BANKNOTE) */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-brand-dark/5 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Pix', icon: QrCode },
              { id: 'Cartao', icon: CreditCard },
              { id: 'Dinheiro', icon: Banknote }
            ].map((m) => (
              <button key={m.id} type="button" onClick={() => setFormData(p => ({...p, paymentMethod: m.id as PaymentMethod}))}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === m.id ? 'border-brand-orange bg-brand-orange text-white' : 'border-transparent bg-brand-dark/5 text-brand-dark/30'}`}>
                <m.icon size={20} />
                <span className="text-[9px] font-black uppercase tracking-tighter">{m.id}</span>
              </button>
            ))}
          </div>
          {formData.paymentMethod === 'Dinheiro' && (
            <input type="text" name="changeFor" value={formData.changeFor} onChange={handleChange} placeholder="Troco para quanto?" 
              className="w-full p-5 rounded-2xl bg-brand-yellow/10 border-2 border-dashed border-brand-yellow/30 outline-none font-bold text-brand-dark" />
          )}
        </section>
      </div>

      {/* BOTÃO FINAL (Usa o ícone MESSAGECIRCLE) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-brand-dark/5 z-50 shadow-2xl">
        <div className="max-w-xl mx-auto text-center">
          <button onClick={handleSubmit} disabled={isEmpty} 
            className="w-full bg-brand-orange text-white py-6 rounded-3xl font-black text-lg shadow-floating flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-30">
            <span>Pedir no WhatsApp</span>
            <MessageCircle size={24} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;