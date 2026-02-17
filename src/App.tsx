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

// Icons
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'MENU' | 'CHECKOUT' | 'MANAGER_LOGIN' | 'MANAGER_DASHBOARD'>('MENU');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(checkStoreOpen());
  const [storeConfig, setStoreConfig] = useState({
    store_open: true,
    delivery: true,
    pickup: true,
  });

  const [_, setManagerPassword] = useState<string>(() =>
    localStorage.getItem('manager_password') || MANAGER_CREDENTIALS.password
  );

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { cart, handleUpdateQuantity, subtotal } = useCart(products);

  // =============================
  // FETCH PRODUCTS
  // =============================
  const fetchProducts = async () => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        setProducts(MENU_ITEMS);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      setProducts(Array.isArray(data) && data.length > 0 ? data : MENU_ITEMS);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setProducts(MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // FETCH STORE CONFIG
  // =============================
  const fetchStoreConfig = async () => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data, error } = await supabase
      .from('store_config')
      .select('*');

    if (error) {
      console.error('Erro ao buscar store_config:', error);
      return;
    }

    if (!Array.isArray(data)) return;

    const getStatus = (id: string, fallback = true) =>
      data.find((i: any) => i.id === id)?.status ?? fallback;

    setStoreConfig({
      store_open: getStatus('store_open'),
      delivery: getStatus('delivery'),
      pickup: getStatus('pickup'),
    });
  };

  // =============================
  // REALTIME + EFFECT
  // =============================
  useEffect(() => {
    fetchProducts();
    fetchStoreConfig();

    const timer = setInterval(
      () => setIsStoreOpen(checkStoreOpen()),
      60000
    );

    let prodChannel: any;
    let configChannel: any;

    if (isSupabaseConfigured && supabase) {
      prodChannel = supabase
        .channel('products_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => fetchProducts()
        )
        .subscribe();

      configChannel = supabase
        .channel('config_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'store_config' },
          () => fetchStoreConfig()
        )
        .subscribe();
    }

    return () => {
      clearInterval(timer);

      if (supabase && prodChannel) supabase.removeChannel(prodChannel);
      if (supabase && configChannel) supabase.removeChannel(configChannel);
    };
  }, []);

  // =============================
  // HANDLERS
  // =============================
  const handleToggleAvailability = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = !product.available;

    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, available: newStatus } : p)
    );

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('products')
        .update({ available: newStatus })
        .eq('id', id);
    }
  };

  const handleUpdateStoreConfig = async (
    type: 'delivery' | 'pickup',
    currentStatus: boolean
  ) => {
    const newStatus = !currentStatus;

    setStoreConfig(prev => ({ ...prev, [type]: newStatus }));

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('store_config')
        .update({ status: newStatus })
        .eq('id', type);
    }
  };

  const handleAddProduct = async (product: Product) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').insert([product]);
    }
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
    fetchProducts();
  };

  // =============================
  // MENU AGRUPADO
  // =============================
  const groupedMenu = useMemo(() => {
    const groups: Partial<Record<Category, Product[]>> = {};

    Object.values(Category).forEach(cat => {
      groups[cat] = products.filter(item => item.category === cat);
    });

    return groups;
  }, [products]);

  // =============================
  // VIEWS
  // =============================
  if (view === 'CHECKOUT')
    return (
      <Checkout
        cart={cart}
        subtotal={subtotal}
        onBack={() => setView('MENU')}
        isStoreOpen={isStoreOpen}
        storeConfig={storeConfig}
      />
    );

  if (view === 'MANAGER_LOGIN')
    return (
      <ManagerLogin
        onLoginSuccess={() => setView('MANAGER_DASHBOARD')}
        onBack={() => setView('MENU')}
      />
    );

  if (view === 'MANAGER_DASHBOARD')
    return (
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

  // =============================
  // UI PRINCIPAL
  // =============================
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <main className="max-w-2xl mx-auto w-full px-4">
        <StoreStatus isOpen={isStoreOpen} />

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin mx-auto" size={32} />
          </div>
        ) : (
          <div className="space-y-12 pb-40">
            {Object.entries(groupedMenu).map(([category, items]) =>
              items && items.length > 0 ? (
                <section
                  key={category}
                  ref={(el: HTMLDivElement | null) => {
                    categoryRefs.current[category] = el;
                  }}
                >
                  <h2 className="text-2xl font-bold">{category}</h2>

                  {items.map(product => (
                    <MenuItem
                      key={product.id}
                      product={product}
                      quantity={
                        cart.find(i => i.id === product.id)?.quantity || 0
                      }
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </section>
              ) : null
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
