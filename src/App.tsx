<<<<<<< HEAD
/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { Category, Product } from './types';
import { MANAGER_CREDENTIALS, MENU_ITEMS } from './constants';
import { checkStoreOpen } from './utils';
import { useCart } from './hooks/useCart';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Components
=======
import React, { useState, useEffect, useMemo } from 'react';
import { Category, CartItem, Product } from './types';
import { MENU_ITEMS } from './constants';
import { formatCurrency, checkStoreOpen } from './utils';
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
import MenuItem from './components/MenuItem';
import Checkout from './components/Checkout';
import StoreStatus from './components/StoreStatus';
import ManagerLogin from './components/ManagerLogin';
import ManagerDashboard from './components/ManagerDashboard';
<<<<<<< HEAD

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
=======
import { ShoppingBasket, Instagram, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'MENU' | 'CHECKOUT' | 'MANAGER_LOGIN' | 'MANAGER_DASHBOARD'>('MENU');
  
  // State for products (loaded from localStorage or constants)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products_availability');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved availability with current constants (in case prices/names changed in code)
        return MENU_ITEMS.map(item => {
          const savedItem = parsed.find((p: Product) => p.id === item.id);
          return savedItem ? { ...item, available: savedItem.available } : item;
        });
      } catch (e) {
        return MENU_ITEMS;
      }
    }
    return MENU_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState(checkStoreOpen());

  // Check store status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsStoreOpen(checkStoreOpen());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save products availability changes
  useEffect(() => {
    localStorage.setItem('products_availability', JSON.stringify(products));
  }, [products]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === id);
      const product = products.find(p => p.id === id);
      
      if (!product) return prevCart;

      // Prevent adding sold out items
      if (delta > 0 && !product.available) return prevCart;

      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prevCart.filter(item => item.id !== id);
        }
        return prevCart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
      } else if (delta > 0) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const handleToggleAvailability = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ));
    
    // Remove from cart if becomes unavailable
    setCart(prev => prev.filter(item => {
      if (item.id === id) {
        if (!products.find(p => p.id === id)?.available) {
          return false;
        }
        return true;
      }
      return true;
    }));
  };

  const getQuantity = (id: string) => cart.find(item => item.id === id)?.quantity || 0;
  
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  // Group items by category
  const groupedMenu = useMemo(() => {
    const groups: Partial<Record<Category, Product[]>> = {};
    Object.values(Category).forEach(cat => {
      groups[cat] = products.filter(item => item.category === cat);
    });
    return groups;
  }, [products]);

  // Main Render Logic
  const renderContent = () => {
    switch (view) {
      case 'CHECKOUT':
        return (
          <Checkout 
            cart={cart} 
            subtotal={subtotal} 
            isStoreOpen={isStoreOpen}
            onBack={() => {
                window.scrollTo(0,0);
                setView('MENU');
            }} 
          />
        );
      case 'MANAGER_LOGIN':
        return (
          <ManagerLogin 
            onLoginSuccess={() => setView('MANAGER_DASHBOARD')}
            onBack={() => setView('MENU')}
          />
        );
      case 'MANAGER_DASHBOARD':
        return (
          <ManagerDashboard 
            products={products}
            onToggleAvailability={handleToggleAvailability}
            onLogout={() => setView('MENU')}
            onBack={() => setView('MENU')}
          />
        );
      case 'MENU':
      default:
        return (
          <>
            <StoreStatus isOpen={isStoreOpen} />

            <div className="max-w-2xl mx-auto mt-6 space-y-8 pb-24">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <section key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <h2 className="bg-white px-6 py-4 border-b border-gray-100 text-xl font-bold text-brand-red flex items-center gap-2 sticky top-0 z-10">
                    <div className="w-1.5 h-6 bg-brand-red rounded-full mr-2"></div>
                    {category}
                  </h2>
                  <div className="divide-y divide-gray-50">
                    {(items as Product[])?.map(product => (
                      <MenuItem 
                        key={product.id} 
                        product={product} 
                        quantity={getQuantity(product.id)}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Floating Footer for Menu */}
            {subtotal > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-slide-up">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Total do pedido</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <button 
                    onClick={() => {
                        window.scrollTo(0,0);
                        setView('CHECKOUT');
                    }}
                    className="bg-brand-red hover:bg-brand-darkRed text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Avançar</span>
                    <ShoppingBasket size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans">
      
      {/* Header Hero */}
      <header className="bg-brand-red text-white pt-10 pb-16 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffcf33 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}>
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">
            Casa da Esfirra
          </h1>
          <p className="text-brand-yellow font-medium text-lg md:text-xl drop-shadow-sm">
            Sabor que conquista desde o primeiro pedaço!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 -mt-8 relative z-20">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm mt-8 pb-28">
        <p className="mb-4">© 2025 Casa da Esfirra — Sabor que conquista!</p>
        
        <div className="flex justify-center items-center gap-6 mb-4">
          <a 
            href="https://www.instagram.com/casadaesfihaitabuna" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-red font-semibold hover:text-brand-darkRed transition-colors"
          >
            <Instagram size={18} /> Instagram
          </a>
          
          {/* Manager Access Button */}
          {view === 'MENU' && (
            <button 
              onClick={() => setView('MANAGER_LOGIN')}
              className="inline-flex items-center gap-1 text-gray-300 hover:text-gray-500 transition-colors text-xs"
              aria-label="Área do Gerente"
            >
              <Lock size={14} /> <span className="sr-only">Gerente</span>
            </button>
          )}
        </div>
      </footer>
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
    </div>
  );
};

export default App;