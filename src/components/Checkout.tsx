import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Send, User, CreditCard, Banknote, QrCode, Receipt, ShieldCheck, MapPin
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
    if (!formData.name.trim()) return alert("Por favor, informe seu nome.");
    
    localStorage.setItem('customerData', JSON.stringify({ name: formData.name, paymentMethod: formData.paymentMethod }));
    const link = generateWhatsAppMessage(cart, formData, subtotal, 0, subtotal, isStoreOpen);
    window.open(link, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-48 animate-fade-up">
      <div className="flex items-center gap-6 py-12 mb-6">
        <button onClick={onBack} className="w-16 h-16 flex items-center justify-center rounded-[1.5rem] bg-white border border-brand-secondary text-brand-dark shadow-sm active:scale-90 transition-all">
          <ArrowLeft size={28} />
        </button>
        <div>
          <h2 className="text-4xl font-serif font-black text-brand-dark tracking-tight">Finalizar</h2>
          <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Confirme seu Pedido</p>
        </div>
      </div>

      <div className="space-y-12">
        <div className="bg-white rounded-[3rem] shadow-premium border border-brand-secondary/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-brand-primary"></div>
          <div className="p-12">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <Receipt className="text-brand-primary" size={28} />
                <span className="font-black uppercase tracking-[0.3em] text-[11px] text-brand-dark">Resumo Gourmet</span>
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <span className="font-black text-brand-primary text-sm bg-brand-primary/5 w-10 h-10 flex items-center justify-center rounded-xl border border-brand-primary/10">{item.quantity}x</span>
                    <div>
                      <span className="text-brand-dark font-black text-lg block leading-none">{item.name}</span>
                      <span className="text-[11px] text-brand-dark/30 font-bold uppercase tracking-widest">{formatCurrency(item.price)} cada</span>
                    </div>
                  </div>
                  <span className="text-brand-dark font-black text-lg">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t-4 border-dashed border-brand-cream">
              <div className="flex justify-between items-center text-5xl font-serif font-black text-brand-dark">
                <span className="text-2xl">Total</span>
                <span className="tracking-tighter text-brand-primary">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </div>
          <div className="bg-brand-secondary text-brand-dark px-12 py-6 flex items-center justify-center gap-4">
            <MapPin size={20} className="text-brand-accent" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Retirada na Casa da Esfirra</span>
          </div>
        </div>

        <div className="grid gap-8">
           <section className="bg-white p-10 rounded-[3rem] border border-brand-secondary/10 shadow-premium">
             <label className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.5em] mb-6 block">Quem receberá o pedido?</label>
             <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/30" size={24} />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full pl-16 pr-8 py-7 rounded-2xl bg-brand-cream/50 border-2 border-transparent focus:border-brand-primary transition-all font-black text-brand-dark outline-none text-xl placeholder:text-brand-dark/10"
                  placeholder="Nome Completo"
                />
             </div>
           </section>

           <section className="bg-white p-10 rounded-[3rem] border border-brand-secondary/10 shadow-premium">
             <label className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.5em] mb-8 block">Forma de Pagamento</label>
             <div className="grid grid-cols-3 gap-5">
                {[
                  { id: 'Pix', icon: QrCode },
                  { id: 'Cartao', icon: CreditCard },
                  { id: 'Dinheiro', icon: Banknote }
                ].map((m) => (
                  <button
                    key={m.id} type="button"
                    onClick={() => setFormData(p => ({...p, paymentMethod: m.id as PaymentMethod}))}
                    className={`flex flex-col items-center gap-4 p-8 rounded-[2rem] border-4 transition-all duration-500 ${
                      formData.paymentMethod === m.id 
                        ? 'border-brand-primary bg-brand-primary text-white shadow-premium scale-105' 
                        : 'border-transparent bg-brand-cream/50 text-brand-dark/20 hover:bg-white hover:border-brand-secondary/30'
                    }`}
                  >
                    <m.icon size={36} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.id}</span>
                  </button>
                ))}
             </div>
           </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-10 bg-brand-cream/90 backdrop-blur-xl border-t border-brand-secondary/20 z-50">
        <div className="max-w-xl mx-auto">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-brand-primary text-white py-8 rounded-full font-black text-2xl shadow-premium flex items-center justify-center gap-6 hover:bg-brand-dark active:scale-95 transition-all uppercase tracking-[0.2em]"
          >
            Confirmar Pedido <Send size={32} fill="currentColor" />
          </button>
          <div className="mt-8 flex items-center justify-center gap-3 text-brand-secondary">
            <ShieldCheck size={20} className="text-brand-accent" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-dark/30">Processamento Seguro via WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;