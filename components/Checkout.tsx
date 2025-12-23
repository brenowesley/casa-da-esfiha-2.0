import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Send, User, CreditCard, ShoppingBag, Store, 
  Banknote, QrCode, Receipt, ShieldCheck, MapPin, Smartphone
} from 'lucide-react';
import { CartItem, CustomerData, PaymentMethod } from '../types';
import { formatCurrency, generateWhatsAppMessage } from '../utils';

interface CheckoutProps {
  cart: CartItem[];
  subtotal: number;
  isStoreOpen: boolean;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, subtotal, isStoreOpen, onBack }) => {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    deliveryType: 'pickup',
    bairro: '', rua: '', numero: '', complemento: '', referencia: '',
    paymentMethod: 'Pix',
    changeFor: '',
    observation: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('customerData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed, deliveryType: 'pickup' }));
      } catch (e) {}
    }
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Por favor, informe seu nome para o pedido.");
    
    localStorage.setItem('customerData', JSON.stringify({ name: formData.name, paymentMethod: formData.paymentMethod }));
    const link = generateWhatsAppMessage(cart, formData, subtotal, 0, subtotal, isStoreOpen);
    window.open(link, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-48 animate-slide-in bg-brand-cream min-h-screen">
      <div className="flex items-center gap-6 py-10 mb-6">
        <button onClick={onBack} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-brand-gold/10 text-brand-maroon shadow-sm hover:shadow-md transition-all">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-4xl font-serif font-black text-brand-maroon tracking-tight">Finalizar</h2>
          <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em]">Confira seu pedido</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Recibo Premium */}
        <div className="bg-white rounded-[3rem] shadow-premium border border-brand-gold/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-maroon/10"></div>
          <div className="p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <Receipt className="text-brand-maroon" size={24} />
                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-brand-maroon">Cupom Não Fiscal</span>
              </div>
              <span className="text-[9px] font-bold text-slate-300 uppercase">Itabuna • Bahia</span>
            </div>
            
            <div className="space-y-6 mb-10">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span className="font-black text-brand-maroon text-sm bg-brand-cream w-8 h-8 flex items-center justify-center rounded-lg border border-brand-gold/10">{item.quantity}x</span>
                    <div>
                      <span className="text-slate-800 font-bold text-sm block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium italic">{formatCurrency(item.price)} cada</span>
                    </div>
                  </div>
                  <span className="text-brand-maroon font-black text-sm">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-dashed border-slate-200">
              <div className="flex justify-between items-center text-4xl font-serif font-black text-brand-maroon">
                <span>Total</span>
                <span className="tracking-tighter">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </div>
          <div className="bg-brand-maroon text-white/90 px-10 py-5 flex items-center justify-center gap-3">
            <MapPin size={16} className="text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retirada: Centro, Itabuna</span>
          </div>
        </div>

        {/* Formulário Profissional */}
        <div className="grid gap-10">
           <section className="bg-white p-10 rounded-[3rem] border border-brand-gold/5 shadow-premium">
             <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-6 block">Seu Nome</label>
             <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-gold/40" size={22} />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full pl-16 pr-8 py-6 rounded-2xl bg-brand-cream border-transparent focus:bg-white focus:border-brand-maroon transition-all font-bold text-brand-maroon outline-none text-lg"
                  placeholder="Ex: Pedro Alvares"
                />
             </div>
           </section>

           <section className="bg-white p-10 rounded-[3rem] border border-brand-gold/5 shadow-premium">
             <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-6 block">Pagamento na Retirada</label>
             <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'Pix', icon: QrCode },
                  { id: 'Cartao', icon: CreditCard },
                  { id: 'Dinheiro', icon: Banknote }
                ].map((m) => (
                  <button
                    key={m.id} type="button"
                    onClick={() => setFormData(p => ({...p, paymentMethod: m.id as PaymentMethod}))}
                    className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all ${
                      formData.paymentMethod === m.id 
                        ? 'border-brand-maroon bg-brand-maroon text-brand-cream shadow-xl scale-105' 
                        : 'border-transparent bg-brand-cream text-brand-maroon/30 hover:bg-white hover:border-brand-gold/20'
                    }`}
                  >
                    <m.icon size={32} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-tight">{m.id}</span>
                  </button>
                ))}
             </div>
           </section>

           <section className="bg-white p-10 rounded-[3rem] border border-brand-gold/5 shadow-premium">
             <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-6 block">Observações do Pedido</label>
             <textarea 
               name="observation" rows={3} value={formData.observation} onChange={handleChange}
               className="w-full p-8 rounded-2xl bg-brand-cream border-transparent focus:bg-white focus:border-brand-maroon transition-all font-medium text-slate-600 resize-none outline-none"
               placeholder="Ex: Por favor, enviar as esfirras doces em caixa separada..."
             ></textarea>
           </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 glass-nav border-t border-brand-gold/10 z-50">
        <div className="max-w-xl mx-auto">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-brand-maroon text-brand-cream py-8 rounded-full font-black text-xl shadow-premium flex items-center justify-center gap-5 hover:bg-brand-dark active:scale-95 transition-all uppercase tracking-widest border border-brand-gold/20"
          >
            Enviar via WhatsApp <Send size={26} fill="currentColor" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-3 text-brand-gold/60">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ambiente Seguro & Criptografado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;