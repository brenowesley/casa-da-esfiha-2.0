import React, { useState } from 'react';
import { Product, Category } from '../types';
import { formatCurrency, generateId } from '../utils';
import { 
  ArrowLeft, CheckCircle, XCircle, Plus, 
  Trash2, List, Save, Lock, Loader2, LogOut,
  Truck, Store, ShieldCheck, ShoppingBag
} from 'lucide-react';

interface ManagerDashboardProps {
  products: Product[];
  storeConfig: { delivery: boolean, pickup: boolean }; // Adicionado
  onUpdateStoreConfig: (type: 'delivery' | 'pickup', currentStatus: boolean) => Promise<void>; // Adicionado
  onToggleAvailability: (id: string) => Promise<void>;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdatePassword: (newPassword: string) => void;
  onLogout: () => void;
  onBack: () => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  products, 
  storeConfig,
  onUpdateStoreConfig,
  onToggleAvailability, 
  onAddProduct, 
  onDeleteProduct,
  onUpdatePassword, 
  onLogout, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'ADD' | 'SECURITY'>('STOCK');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState<string | null>(null);

  // Form States
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.TRADICIONAL);
  const [newPassword, setNewPassword] = useState('');

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    await onToggleAvailability(id);
    setLoadingId(null);
  };

  const handleUpdateConfig = async (type: 'delivery' | 'pickup', status: boolean) => {
    setLoadingConfig(type);
    await onUpdateStoreConfig(type, status);
    setLoadingConfig(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    onAddProduct({
      id: generateId(),
      name: newName, 
      price: parseFloat(newPrice.replace(',', '.')), 
      category: newCategory, 
      available: true
    });
    setNewName(''); setNewPrice(''); setActiveTab('STOCK');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-40 animate-fade-up">
      
      {/* HEADER DO PAINEL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-brand-dark/5 text-brand-dark shadow-sm hover:bg-brand-orange hover:text-white transition-all group"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-serif font-black text-brand-dark tracking-tight">Painel do Gênio</h2>
            <p className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">Gestão Administrativa</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-6 py-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
        >
          <LogOut size={16} /> Sair do Painel
        </button>
      </div>

      {/* NAVEGAÇÃO DE ABAS */}
      <nav className="flex bg-brand-dark/5 p-2 rounded-[2rem] mb-12 shadow-inner">
        {[
          { id: 'STOCK', label: 'Estoque', icon: List },
          { id: 'ADD', label: 'Novo Item', icon: Plus },
          { id: 'SECURITY', label: 'Segurança', icon: Lock }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id 
              ? 'bg-white text-brand-orange shadow-lg scale-[1.02]' 
              : 'text-brand-dark/40 hover:text-brand-dark'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO DAS ABAS */}
      <div className="min-h-[500px]">
        
        {activeTab === 'STOCK' && (
          <div className="space-y-10 animate-fade-in">
            
            {/* 1. CONTROLE GLOBAL DE OPERAÇÃO */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40 mb-6 ml-4">Controle de Operação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Botão Delivery */}
                <button 
                  disabled={loadingConfig === 'delivery'}
                  onClick={() => handleUpdateConfig('delivery', storeConfig.delivery)}
                  className={`p-6 rounded-[2.5rem] flex items-center justify-between border-2 transition-all active:scale-95 ${
                    storeConfig.delivery 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-red-50 border-red-200 text-red-700 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${storeConfig.delivery ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                      {loadingConfig === 'delivery' ? <Loader2 className="animate-spin" /> : <Truck size={24} />}
                    </div>
                    <div className="text-left leading-tight">
                      <p className="font-black text-xs uppercase tracking-widest">Delivery</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase">{storeConfig.delivery ? 'Ativo' : 'Pausado'}</p>
                    </div>
                  </div>
                  {storeConfig.delivery ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </button>

                {/* Botão Retirada */}
                <button 
                  disabled={loadingConfig === 'pickup'}
                  onClick={() => handleUpdateConfig('pickup', storeConfig.pickup)}
                  className={`p-6 rounded-[2.5rem] flex items-center justify-between border-2 transition-all active:scale-95 ${
                    storeConfig.pickup 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-red-50 border-red-200 text-red-700 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${storeConfig.pickup ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                      {loadingConfig === 'pickup' ? <Loader2 className="animate-spin" /> : <Store size={24} />}
                    </div>
                    <div className="text-left leading-tight">
                      <p className="font-black text-xs uppercase tracking-widest">Retirada</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase">{storeConfig.pickup ? 'Ativo' : 'Pausado'}</p>
                    </div>
                  </div>
                  {storeConfig.pickup ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </button>
              </div>
            </section>

            {/* 2. LISTA DE PRODUTOS POR CATEGORIA */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40 mb-4 ml-4">Itens do Cardápio</h3>
              {Object.values(Category).map(cat => {
                const items = products.filter(p => p.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="bg-white rounded-[2.5rem] border border-brand-dark/5 shadow-premium overflow-hidden">
                    <div className="bg-brand-dark/5 px-8 py-4 flex justify-between items-center border-b border-brand-dark/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">{cat}</h4>
                      <span className="text-[10px] font-bold text-brand-dark/20">{items.length} Sabores</span>
                    </div>
                    <div className="divide-y divide-brand-dark/5">
                      {items.map(product => (
                        <div key={product.id} className="flex items-center justify-between px-8 py-6 hover:bg-brand-yellow/5 transition-colors group">
                          <div>
                            <p className={`font-bold text-lg leading-tight transition-all ${!product.available ? 'text-brand-dark/20 line-through' : 'text-brand-dark'}`}>
                              {product.name}
                            </p>
                            <p className="text-sm font-black text-brand-orange mt-1">{formatCurrency(product.price)}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <button
                              disabled={loadingId === product.id}
                              onClick={() => handleToggle(product.id)}
                              className={`min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase border transition-all active:scale-95 ${
                                product.available 
                                ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' 
                                : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                              }`}
                            >
                              {loadingId === product.id ? <Loader2 className="animate-spin" size={14} /> : (product.available ? <CheckCircle size={14} /> : <XCircle size={14} />)}
                              {product.available ? 'No Ar' : 'Pausado'}
                            </button>

                            <button 
                              onClick={() => { if(window.confirm(`Excluir ${product.name}?`)) onDeleteProduct(product.id) }}
                              className="p-3 text-brand-dark/10 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        )}

        {activeTab === 'ADD' && (
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-premium border border-brand-dark/5 max-w-xl mx-auto w-full animate-fade-up">
             <div className="text-center mb-12">
                <div className="w-20 h-20 bg-brand-orange/10 rounded-[2rem] rotate-6 flex items-center justify-center mx-auto mb-6 text-brand-orange shadow-lg shadow-brand-orange/5">
                    <Plus size={40} className="-rotate-6" />
                </div>
                <h3 className="text-3xl font-serif font-black text-brand-dark tracking-tight">Novo Sabor</h3>
                <p className="text-sm text-brand-dark/40 mt-2 font-bold uppercase tracking-widest">Expandindo a magia</p>
             </div>

             <form onSubmit={handleAdd} className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-4">Nome da Esfiha</label>
                 <input 
                    type="text" value={newName} onChange={e => setNewName(e.target.value)} 
                    className="w-full p-6 rounded-2xl bg-brand-dark/5 border-2 border-transparent focus:border-brand-orange/30 focus:bg-white outline-none font-bold text-brand-dark transition-all" 
                    placeholder="Ex: Chocolate com Morango" required 
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-4">Preço (R$)</label>
                    <input 
                        type="text" value={newPrice} onChange={e => setNewPrice(e.target.value)} 
                        className="w-full p-6 rounded-2xl bg-brand-dark/5 border-2 border-transparent focus:border-brand-orange/30 focus:bg-white outline-none font-bold text-brand-dark transition-all" 
                        placeholder="0,00" required 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-4">Categoria</label>
                    <div className="relative">
                      <select 
                          value={newCategory} onChange={e => setNewCategory(e.target.value as Category)} 
                          className="w-full p-6 rounded-2xl bg-brand-dark/5 border-2 border-transparent focus:border-brand-orange/30 focus:bg-white outline-none font-bold text-brand-dark appearance-none cursor-pointer transition-all"
                      >
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                        <Plus size={16} />
                      </div>
                    </div>
                 </div>
               </div>

               <button 
                  type="submit" 
                  className="w-full bg-brand-orange text-white py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-floating hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                 <Save size={20} /> Salvar no Cardápio
               </button>
             </form>
          </div>
        )}

        {activeTab === 'SECURITY' && (
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-premium border border-brand-dark/5 max-w-xl mx-auto w-full animate-fade-up">
             <div className="text-center mb-12">
                <div className="w-20 h-20 bg-brand-dark/10 rounded-[2rem] -rotate-6 flex items-center justify-center mx-auto mb-6 text-brand-dark shadow-lg">
                    <Lock size={40} className="rotate-6" />
                </div>
                <h3 className="text-3xl font-serif font-black text-brand-dark tracking-tight">Segurança</h3>
                <p className="text-sm text-brand-dark/40 mt-2 font-bold uppercase tracking-widest">Protegendo o Painel</p>
             </div>

             <form onSubmit={e => { e.preventDefault(); onUpdatePassword(newPassword); alert('Senha salva!'); setNewPassword(''); }} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30 ml-4 text-center block">Nova Senha de Acesso</label>
                    <input 
                        type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} 
                        className="w-full p-6 rounded-2xl bg-brand-dark/5 border-2 border-transparent focus:border-brand-orange/30 focus:bg-white outline-none font-bold text-brand-dark text-center text-xl tracking-[0.3em] transition-all" 
                        placeholder="••••••••" required 
                    />
                </div>
                <button type="submit" className="w-full bg-brand-dark text-white py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95">
                  Atualizar Chave Mestra
                </button>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;