import React, { useState, useEffect, useMemo } from 'react';
import { Category, CartItem, Product } from './types';
import { MENU_ITEMS } from './constants';
import { formatCurrency, checkStoreOpen } from './utils';
import MenuItem from './components/MenuItem';
import Checkout from './components/Checkout';
import StoreStatus from './components/StoreStatus';
import ManagerLogin from './components/ManagerLogin';
import ManagerDashboard from './components/ManagerDashboard';
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
        const prod = products.find(p => p.id === id);
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
    </div>
  );
};

export default App;