import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Receipt, QrCode, 
  CreditCard, Banknote, ShieldCheck, 
  Store, MessageCircle
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Por favor, informe seu nome.");
    
    localStorage.setItem('customerData', JSON.stringify({ name: formData.name }));
    const link = generateWhatsAppMessage(cart, formData, subtotal, 0, subtotal, isStoreOpen);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-40 animate-fade-up px-4">
      <div className="max-w-xl mx-auto pt-10 mb-8">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-brand-dark/5 shadow-sm active:scale-90 transition-all">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-serif font-black text-brand-dark tracking-tight">Checkout</h2>
        </div>
      </div>

      <main className="max-w-xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-brand-orange/30 flex items-start gap-4">
          <Store size={24} className="text-brand-orange" />
          <div>
            <h4 className="font-black text-brand-dark text-xs uppercase tracking-widest">Retirada no Balcão</h4>
            <p className="text-sm text-brand-dark/50 mt-1 italic">Rua Itabuna, Centro</p>
          </div>
        </div>

        <section className="bg-white rounded-[3rem] shadow-premium border border-brand-dark/5 overflow-hidden p-8">
          <div className="flex items-center gap-3 mb-6">
            <Receipt size={20} className="text-brand-orange" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-brand-dark/40">Resumo</span>
          </div>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b border-brand-cream last:border-0">
              <span className="text-brand-dark font-bold">{item.quantity}x {item.name}</span>
              <span className="font-black text-brand-dark/40">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-6 pt-6 flex justify-between items-center border-t-2 border-brand-cream">
            <span className="font-black text-xs uppercase text-brand-dark/40">Total</span>
            <span className="text-3xl font-serif font-black text-brand-orange tracking-tighter">{formatCurrency(subtotal)}</span>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] border border-brand-dark/5 shadow-premium space-y-6">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome" className="w-full px-6 py-5 rounded-2xl bg-brand-cream outline-none font-bold text-brand-dark focus:ring-2 focus:ring-brand-orange/20 transition-all" />
          <div className="grid grid-cols-3 gap-3">
            {['Pix', 'Cartao', 'Dinheiro'].map((m) => (
              <button key={m} type="button" onClick={() => setFormData(p => ({...p, paymentMethod: m as PaymentMethod}))}
                className={`p-4 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${formData.paymentMethod === m ? 'border-brand-orange bg-brand-orange text-white' : 'border-transparent bg-brand-cream text-brand-dark/40'}`}>
                {m === 'Pix' && <QrCode size={20} className="mx-auto mb-2" />}
                {m === 'Cartao' && <CreditCard size={20} className="mx-auto mb-2" />}
                {m === 'Dinheiro' && <Banknote size={20} className="mx-auto mb-2" />}
                {m}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-brand-dark/5 z-50 shadow-2xl">
        <div className="max-w-xl mx-auto">
          <button onClick={handleSubmit} disabled={isEmpty} className="w-full bg-brand-orange text-white py-6 rounded-3xl font-black text-lg shadow-floating flex items-center justify-center gap-4 hover:bg-brand-dark active:scale-95 transition-all uppercase tracking-widest disabled:opacity-30">
            <span>Enviar WhatsApp</span>
            <MessageCircle size={24} fill="white" />
          </button>
          <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processamento Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;