/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo, useRef } from 'react';
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

// Style & Icons
import { ShoppingBasket, Instagram, Lock, ChevronRight, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // --- Estados de Navegação ---
  const [view, setView] = useState<'MENU' | 'CHECKOUT' | 'MANAGER_LOGIN' | 'MANAGER_DASHBOARD'>('MENU');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.TRADICIONAL);
  
  // --- Estados de Dados ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(checkStoreOpen());
  const [storeConfig, setStoreConfig] = useState({ delivery: true, pickup: true });
  
  const [_, setManagerPassword] = useState<string>(() => 
    localStorage.getItem('manager_password') || MANAGER_CREDENTIALS.password
  );

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const { cart, handleUpdateQuantity, totalItems, formattedSubtotal, isEmpty, subtotal } = useCart(products);

  // --- 1. Sincronização com Supabase (Realtime) ---
  
  const fetchProducts = async () => {
    try {
      if (!isSupabaseConfigured) return setProducts(MENU_ITEMS);
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) throw error;
      setProducts(data?.length ? data : MENU_ITEMS);
    } catch (err) {
      setProducts(MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  }; 
  

const fetchStoreConfig = async () => {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from('store_config').select('*');
  if (data) {
    setStoreConfig({
      // PRECISA SER .status (exatamente como no banco)
      delivery: data.find((i: any) => i.id === 'delivery')?.status ?? true,
      pickup: data.find((i: any) => i.id === 'pickup')?.status ?? true,
    });
  }
};

  useEffect(() => {
    fetchProducts();
    fetchStoreConfig();
    
    const timer = setInterval(() => setIsStoreOpen(checkStoreOpen()), 60000);

    if (isSupabaseConfigured) {
      // Ouve mudanças nos Produtos
      const prodChannel = supabase.channel('products_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
        .subscribe();

      // Ouve mudanças no Delivery/Retirada (Realtime)
      const configChannel = supabase.channel('config_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'store_config' }, () => fetchStoreConfig())
        .subscribe();

      return () => {
        supabase.removeChannel(prodChannel);
        supabase.removeChannel(configChannel);
        clearInterval(timer);
      };
    }
    return () => clearInterval(timer);
  }, []);

  // --- 2. Handlers de Gestão ---

  const handleToggleAvailability = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStatus = !product.available;

    // Otimista
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: newStatus } : p));

    if (isSupabaseConfigured) {
      await supabase.from('products').update({ available: newStatus }).eq('id', id);
    }
  };

  const handleUpdateStoreConfig = async (type: 'delivery' | 'pickup', currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Otimista
    setStoreConfig(prev => ({ ...prev, [type]: newStatus }));

    if (isSupabaseConfigured) {
      await supabase.from('store_config').update({ status: newStatus }).eq('id', type);
    }
  };

  const handleAddProduct = async (product: Product) => {
    if (isSupabaseConfigured) await supabase.from('products').insert([product]);
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  // --- 3. UI Helpers ---
  const scrollTo = (cat: Category) => {
    setActiveCategory(cat);
    const el = categoryRefs.current[cat];
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
  };

  const groupedMenu = useMemo(() => {
    const groups: Partial<Record<Category, Product[]>> = {};
    Object.values(Category).forEach(cat => {
      groups[cat] = products.filter(item => item.category === cat);
    });
    return groups;
  }, [products]);

  // --- Renderização de Telas ---
  if (view === 'CHECKOUT') return <Checkout cart={cart} subtotal={subtotal} onBack={() => setView('MENU')} isStoreOpen={isStoreOpen} storeConfig={storeConfig} />;
  
  if (view === 'MANAGER_LOGIN') return <ManagerLogin onLoginSuccess={() => setView('MANAGER_DASHBOARD')} onBack={() => setView('MENU')} />;
  
  if (view === 'MANAGER_DASHBOARD') return (
    <ManagerDashboard 
      products={products} 
      storeConfig={storeConfig}
      onUpdateStoreConfig={handleUpdateStoreConfig}
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
      
      {/* HEADER PREMIUM */}
      <header className="relative h-[450px] md:h-[500px] w-full flex flex-col items-center justify-center bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-orange opacity-95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="w-64 h-64 md:w-80 md:h-80 mb-2 flex items-center justify-center transition-transform hover:scale-105 duration-700">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.3)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-brand-dark tracking-tighter leading-none">
            Casa da <span className="text-white italic drop-shadow-md">Esfirra</span>
          </h1>
          <p className="text-brand-dark/60 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">Tradição & Sabor • Itabuna</p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-16 bg-brand-cream rounded-t-[4rem]"></div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 relative z-20 -mt-8">
        <StoreStatus isOpen={isStoreOpen} />

        <nav className="glass-header my-8 flex gap-1 overflow-x-auto no-scrollbar shadow-lg shadow-brand-orange/10">
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => scrollTo(cat)}
              className={`btn-category ${activeCategory === cat ? 'btn-category-active' : 'btn-category-inactive'}`}
            >
              {cat.replace('Esfihas ', '')}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="py-20 text-center space-y-4">
             <div className="w-24 h-24 mx-auto animate-pulse grayscale opacity-20">
                <img src="/logo.png" alt="Loading" className="w-full h-full object-contain" />
             </div>
             <Loader2 className="animate-spin mx-auto text-brand-orange" size={32} />
          </div>
        ) : (
          <div className="space-y-12 pb-40">
            {Object.entries(groupedMenu).map(([category, items]) => (
              items && items.length > 0 && (
                <section key={category} ref={(el) => { categoryRefs.current[category] = el; }} className="scroll-mt-28">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shadow-sm">
                      <Star size={18} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-serif font-black text-brand-dark">{category}</h2>
                    <div className="flex-1 h-px bg-brand-dark/5"></div>
                  </div>
                  
                  <div className="grid gap-6">
                    {items.map(product => (
                      <MenuItem 
                        key={product.id} 
                        product={product} 
                        quantity={cart.find(i => i.id === product.id)?.quantity || 0}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {!isEmpty && view === 'MENU' && (
          <motion.div initial={{ y: 100, x: '-50%' }} animate={{ y: 0, x: '-50%' }} exit={{ y: 100, x: '-50%' }} className="fixed bottom-8 left-1/2 w-[92%] max-w-md z-50">
            <button 
              onClick={() => { window.scrollTo(0,0); setView('CHECKOUT'); }} 
              className="w-full bg-brand-dark text-white rounded-[2.5rem] p-2.5 flex items-center justify-between shadow-floating group active:scale-95 transition-all border border-white/5"
            >
              <div className="flex items-center gap-4 pl-4">
                <div className="bg-brand-orange w-14 h-14 rounded-2xl flex items-center justify-center text-white relative shadow-inner">
                  <ShoppingBasket size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-dark text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-[3px] border-brand-dark animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="text-left leading-none">
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Seu Pedido</p>
                  <p className="text-2xl font-black tracking-tighter">{formattedSubtotal}</p>
                </div>
              </div>
              <div className="bg-brand-yellow text-brand-dark h-14 px-8 rounded-2xl flex items-center font-black text-xs uppercase tracking-widest group-hover:bg-white transition-colors">
                Finalizar <ChevronRight size={20} className="ml-1" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative mt-20 pt-32 pb-16 text-center bg-brand-dark overflow-hidden rounded-t-[4rem] md:rounded-t-[5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-orange opacity-95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        
        <div className="relative z-10 max-w-xs mx-auto space-y-8">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-block p-4 rounded-full bg-brand-dark/5 hover:bg-brand-dark/10 transition-all text-brand-dark">
            <Instagram size={32} />
          </a>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-dark">CASA DA ESFIRRA • ITABUNA</p>
          <button onClick={() => setView('MANAGER_LOGIN')} className="p-4 hover:text-white transition-colors text-brand-dark/20 mx-auto block">
            <Lock size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;