/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { Category, Product } from './types';
import { MANAGER_CREDENTIALS, MENU_ITEMS } from './constants';
import { checkStoreOpen } from './utils';
import { useCart } from './hooks/useCart';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Components
import MenuItem from './components/MenuItem';
import Checkout from './components/Checkout';
import StoreStatus from './components/StoreStatus';
import ManagerLogin from './components/ManagerLogin';
import ManagerDashboard from './components/ManagerDashboard';

// Style
import { ShoppingBasket, ChevronRight, Star, Loader2, Instagram, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<'MENU' | 'CHECKOUT' | 'MANAGER_LOGIN' | 'MANAGER_DASHBOARD'>('MENU');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.TRADICIONAL);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setManagerPassword] = useState<string>(() => 
    localStorage.getItem('manager_password') || MANAGER_CREDENTIALS.password
  );

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const { cart, handleUpdateQuantity, totalItems, formattedSubtotal, isEmpty, subtotal } = useCart(products);

  // 1. BUSCA E SINCRONIZAÇÃO EM TEMPO REAL
  const fetchProducts = async () => {
    try {
      if (!isSupabaseConfigured) return setProducts(MENU_ITEMS);
      const { data } = await supabase.from('products').select('*').order('name');
      setProducts(data?.length ? data : MENU_ITEMS);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProducts();
    if (!isSupabaseConfigured) return;

    // Escuta mudanças de outros aparelhos (Realtime)
    const channel = supabase.channel('menu_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. FUNÇÃO QUE CORRIGE O BOTÃO "NO AR"
  const handleToggleAvailability = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = !product.available;

    // Atualiza no banco
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ available: newStatus })
        .eq('id', id);
      
      if (error) {
        alert("Erro ao salvar no banco!");
        return;
      }
    }

    // Atualiza na tela (Feedback instantâneo)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: newStatus } : p));
  };

  const handleAddProduct = async (product: Product) => {
    if (isSupabaseConfigured) await supabase.from('products').insert([product]);
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const scrollTo = (cat: Category) => {
    setActiveCategory(cat);
    const el = categoryRefs.current[cat];
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
  };

  if (view === 'CHECKOUT') return <Checkout cart={cart} subtotal={subtotal} onBack={() => setView('MENU')} isStoreOpen={checkStoreOpen()} />;
  if (view === 'MANAGER_LOGIN') return <ManagerLogin onLoginSuccess={() => setView('MANAGER_DASHBOARD')} onBack={() => setView('MENU')} />;
  if (view === 'MANAGER_DASHBOARD') return (
    <ManagerDashboard 
      products={products} 
      onToggleAvailability={handleToggleAvailability} 
      onAddProduct={handleAddProduct} 
      onDeleteProduct={handleDeleteProduct}
      onUpdatePassword={setManagerPassword} 
      onLogout={() => setView('MENU')} 
      onBack={() => setView('MENU')} 
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      {/* HEADER PREMIUM COM LOGO GIGANTE */}
      <header className="relative h-[450px] md:h-[500px] w-full flex flex-col items-center justify-center bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-orange opacity-95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 flex flex-col items-center text-center">
          <div className="w-64 h-64 md:w-80 md:h-80 mb-2">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-brand-dark tracking-tighter">
            Casa da <span className="text-white italic drop-shadow-md">Esfirra</span>
          </h1>
          <p className="text-brand-dark/60 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Tradição & Sabor • Itabuna</p>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-brand-cream rounded-t-[4rem]"></div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 relative z-20 -mt-6">
        <StoreStatus isOpen={checkStoreOpen()} />
        <nav className="glass-header my-8 flex gap-1 overflow-x-auto no-scrollbar">
          {Object.values(Category).map(cat => (
            <button key={cat} onClick={() => scrollTo(cat)} className={`btn-category ${activeCategory === cat ? 'btn-category-active' : 'btn-category-inactive'}`}>
              {cat.replace('Esfihas ', '')}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="py-20 text-center space-y-4">
             <div className="w-24 h-24 mx-auto animate-pulse grayscale opacity-20"><img src="/logo.png" alt="" /></div>
             <Loader2 className="animate-spin mx-auto text-brand-orange" />
          </div>
        ) : (
          <div className="space-y-12 pb-40">
            {Object.values(Category).map(cat => (
              <section key={cat} ref={(el) => { categoryRefs.current[cat] = el; }} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange"><Star size={16} fill="currentColor" /></div>
                  <h2 className="text-2xl font-serif font-black">{cat}</h2>
                  <div className="flex-1 h-px bg-brand-dark/5"></div>
                </div>
                <div className="grid gap-6">
                  {products.filter(p => p.category === cat).map(product => (
                    <MenuItem key={product.id} product={product} quantity={cart.find(i => i.id === product.id)?.quantity || 0} onUpdateQuantity={handleUpdateQuantity} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER ESPELHADO */}
      <footer className="relative mt-20 pt-32 pb-16 text-center bg-brand-dark overflow-hidden rounded-t-[4rem] md:rounded-t-[5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-orange opacity-95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="relative z-10 max-w-xs mx-auto space-y-8">
          <Instagram size={32} className="mx-auto text-brand-dark hover:scale-110 transition-transform cursor-pointer" />
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-dark">CASA DA ESFIRRA • ITABUNA</p>
          <button onClick={() => setView('MANAGER_LOGIN')} className="p-4 text-brand-dark/20 mx-auto block"><Lock size={14} /></button>
        </div>
      </footer>

      {/* CARRINHO FLUTUANTE */}
      <AnimatePresence>
        {!isEmpty && view === 'MENU' && (
          <motion.div initial={{ y: 100, x: '-50%' }} animate={{ y: 0, x: '-50%' }} exit={{ y: 100, x: '-50%' }} className="fixed bottom-8 left-1/2 w-[92%] max-w-md z-50">
            <button onClick={() => setView('CHECKOUT')} className="w-full bg-brand-dark text-white rounded-[2.5rem] p-2.5 flex items-center justify-between shadow-floating group active:scale-95 transition-all">
              <div className="flex items-center gap-4 pl-4">
                <div className="bg-brand-orange w-12 h-12 rounded-2xl flex items-center justify-center text-white relative">
                  <ShoppingBasket size={22} />
                  {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-dark text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-brand-dark">{totalItems}</span>}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1">Total</p>
                  <p className="text-xl font-black">{formattedSubtotal}</p>
                </div>
              </div>
              <div className="bg-brand-yellow text-brand-dark h-12 px-8 rounded-2xl flex items-center font-black text-xs uppercase tracking-widest group-hover:bg-white transition-colors">Pedir <ChevronRight size={18} className="ml-1" /></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;