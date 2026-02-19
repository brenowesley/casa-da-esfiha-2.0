/// <reference types="vite/client" />

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Category, Product } from "./types";
import { MANAGER_CREDENTIALS, MENU_ITEMS } from "./constants";
import { checkStoreOpen } from "./utils";
import { useCart } from "./hooks/useCart";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

// Components
import MenuItem from "./components/MenuItem";
import Checkout from "./components/Checkout";
import StoreStatus from "./components/StoreStatus";
import ManagerLogin from "./components/ManagerLogin";
import ManagerDashboard from "./components/ManagerDashboard";

// Icons
import { Loader2, Instagram, Lock } from "lucide-react";

const App: React.FC = () => {
  const [view, setView] = useState<
    "MENU" | "CHECKOUT" | "MANAGER_LOGIN" | "MANAGER_DASHBOARD"
  >("MENU");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(checkStoreOpen());

  const [storeConfig, setStoreConfig] = useState({
    store_open: true,
    delivery: true,
    pickup: true
  });

  const [, setManagerPassword] = useState<string>(() =>
    localStorage.getItem("manager_password") ||
    MANAGER_CREDENTIALS.password
  );

  const categoryRefs = useRef<
    Partial<Record<Category, HTMLElement | null>>
  >({});

  const { cart, handleUpdateQuantity, subtotal } =
    useCart(products);

  const totalItems = cart.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  const isEmpty = totalItems === 0;

  const formattedSubtotal = subtotal.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );


  // FETCH PRODUCTS

  const fetchProducts = async () => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        setProducts(MENU_ITEMS);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;

      setProducts(
        Array.isArray(data) && data.length > 0
          ? data
          : MENU_ITEMS
      );
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProducts(MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };


  // STORE CONFIG

  const fetchStoreConfig = async () => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data } =
      await supabase.from("store_config").select("*");

    if (!Array.isArray(data)) return;

    const getStatus = (
      id: string,
      fallback = true
    ) =>
      data.find((i: any) => i.id === id)
        ?.status ?? fallback;

    // PEGA O VALOR DO BANCO
    const isOpenFromDb = getStatus("store_open");

    // ATUALIZA O OBJETO DE CONFIGURAÇÃO GERAL
    setStoreConfig({
      store_open: isOpenFromDb,
      delivery: getStatus("delivery"),
      pickup: getStatus("pickup")
    });

 
    // ATUALIZA TAMBÉM O ESTADO QUE O CHECKOUT USA
    setIsStoreOpen(isOpenFromDb);
  };

 
  // DASHBOARD HANDLERS

  const handleToggleAvailability = async (
    id: string
  ) => {
    const product = products.find(
      p => p.id === id
    );
    if (!product) return;

    const newStatus = !product.available;

    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, available: newStatus }
          : p
      )
    );

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("products")
        .update({ available: newStatus })
        .eq("id", id);
    }
  };


  const handleUpdateStoreConfig = async (
    configId: string,
    currentStatus: boolean
  ) => {
    const newStatus = !currentStatus;


    setStoreConfig(prev => ({
      ...prev,
     
      [configId]: newStatus
    }));

  

    if (configId === 'store_open') {
      setIsStoreOpen(newStatus);
    }
   
    
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("store_config")
        .update({ status: newStatus })
        .eq("id", configId);

      if (error) {
        console.error("Erro ao atualizar config no Supabase:", error);
    
        setStoreConfig(prev => ({
            ...prev,
            [configId]: currentStatus 
          }));
    
        if (configId === 'store_open') setIsStoreOpen(currentStatus);
      }
    }
  };
  const handleAddProduct = async (
    product: Product
  ) => {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("products")
        .insert([product]);
    }
    fetchProducts();
  };

  const handleDeleteProduct = async (
    id: string
  ) => {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("products")
        .delete()
        .eq("id", id);
    }
    fetchProducts();
  };

 
  // EFFECTS
 
  useEffect(() => {
    fetchProducts();
    fetchStoreConfig();

    const timer = setInterval(
      () => setIsStoreOpen(checkStoreOpen()),
      60000
    );

    return () => clearInterval(timer);
  }, []);

 
  // GROUP MENU

  const groupedMenu = useMemo(() => {
    const groups: Partial<
      Record<Category, Product[]>
    > = {};

    Object.values(Category).forEach(cat => {
      groups[cat] = products.filter(
        item => item.category === cat
      );
    });

    return groups;
  }, [products]);

 
  // VIEWS
 
  if (view === "CHECKOUT")
    return (
      <Checkout
        cart={cart}
        subtotal={subtotal}
        onBack={() => setView("MENU")}
        isStoreOpen={isStoreOpen}
        storeConfig={storeConfig}
      />
    );

  if (view === "MANAGER_LOGIN")
    return (
      <ManagerLogin
        onLoginSuccess={() =>
          setView("MANAGER_DASHBOARD")
        }
        onBack={() => setView("MENU")}
      />
    );

  if (view === "MANAGER_DASHBOARD")
    return (
      <ManagerDashboard
        products={products}
        storeConfig={storeConfig}
        onUpdateStoreConfig={
          handleUpdateStoreConfig
        }
        onToggleAvailability={
          handleToggleAvailability
        }
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdatePassword={
          setManagerPassword
        }
        onLogout={() => setView("MENU")}
        onBack={() => setView("MENU")}
      />
    );


//  UI

return (
  <div className="min-h-screen flex flex-col bg-brand-cream">

    {/* HEADER */}
    <header className="relative h-[450px] flex items-center justify-center overflow-hidden">

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-orange opacity-95"></div>

      {/* Textura */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-64 h-64 object-contain mb-4"
        />
        <h1 className="text-5xl font-black text-brand-dark">
          Casa da <span className="text-white italic">Esfirra</span>
        </h1>
      </motion.div>
    </header>

    <main className="max-w-2xl mx-auto w-full px-4">

      <StoreStatus isOpen={isStoreOpen} />

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin mx-auto" size={32} />
        </div>
      ) : (
        <div className="space-y-12 pb-44">

          {(Object.entries(groupedMenu) as [
            Category,
            Product[]
          ][])
            .filter(([, items]) => items && items.length > 0)
            .map(([category, items]) => (
              <section
                key={category}
                ref={(el: HTMLDivElement | null) =>
                  (categoryRefs.current[category] = el)
                }
              >
                <h2 className="text-2xl font-bold mb-4">
                  {category}
                </h2>

                {items.map(product => (
                  <MenuItem
    key={product.id}
    product={product}
    quantity={cart.find(i => i.id === product.id)?.quantity || 0}
    onUpdateQuantity={handleUpdateQuantity}
   
    isStoreOpen={isStoreOpen}
  />
))}
              </section>
            ))}
        </div>
      )}
    </main>

    {/* CART BUTTON */}
<AnimatePresence>
  {!isEmpty && (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed bottom-6 left-0 w-full flex justify-center z-50"
    >
      <button
        onClick={() => setView("CHECKOUT")}
        className="
          w-[92%] max-w-xl
          rounded-2xl
          px-6 py-5
          flex justify-between items-center
          text-white
          font-semibold text-lg

          bg-gradient-to-r
          from-brand-yellow
          via-brand-orange
          to-brand-orange

          shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          border border-white/10
          backdrop-blur-md

          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all
        "
      >
        <span>{totalItems} itens</span>
        <span className="font-bold">{formattedSubtotal}</span>
      </button>
    </motion.div>
  )}
</AnimatePresence>


    {/* FOOTER */}
    <footer className="relative mt-20 pt-32 pb-16 text-center overflow-hidden rounded-t-[4rem]">

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-yellow to-brand-orange opacity-95"></div>

      {/* Textura */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <div className="relative z-10 text-brand-dark">
        <Instagram className="mx-auto mb-4" />
        <button onClick={() => setView("MANAGER_LOGIN")}>
          <Lock size={14} />
        </button>
      </div>
    </footer>

  </div>
);
};
export default App;
