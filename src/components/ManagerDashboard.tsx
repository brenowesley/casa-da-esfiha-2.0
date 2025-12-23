import React, { useState } from 'react';
import { Product, Category } from '../types';
import { formatCurrency, generateId } from '../utils';
import { 
  ArrowLeft, CheckCircle, XCircle, Plus, 
  Trash2, List, Save, Lock, Loader2, LogOut
} from 'lucide-react';

interface ManagerDashboardProps {
  products: Product[];
  onToggleAvailability: (id: string) => Promise<void>;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdatePassword: (newPassword: string) => void;
  onLogout: () => void;
  onBack: () => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  products, onToggleAvailability, onAddProduct, onDeleteProduct,
  onUpdatePassword, onLogout, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'ADD' | 'SECURITY'>('STOCK');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.TRADICIONAL);
  const [newPassword, setNewPassword] = useState('');

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    await onToggleAvailability(id);
    setLoadingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    onAddProduct({
      id: generateId(), name: newName, 
      price: parseFloat(newPrice.replace(',', '.')), 
      category: newCategory, available: true
    });
    setNewName(''); setNewPrice(''); setActiveTab('STOCK');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-40">
      <div className="flex items-center justify-between py-10">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-brand-dark/5 text-brand-dark shadow-sm">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-2xl font-serif font-black text-brand-dark">Gestão</h2>
        <button onClick={onLogout} className="text-xs font-black text-red-600 bg-red-50 px-6 py-3 rounded-2xl uppercase border border-red-100 transition-all"><LogOut size={16} /></button>
      </div>

      <nav className="flex bg-brand-dark/5 p-2 rounded-[2rem] mb-10 shadow-inner">
        {[
          { id: 'STOCK', label: 'Estoque', icon: List },
          { id: 'ADD', label: 'Novo Item', icon: Plus },
          { id: 'SECURITY', label: 'Segurança', icon: Lock }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-brand-orange shadow-lg' : 'text-brand-dark/40'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'STOCK' && (
        <div className="space-y-6 animate-fade-in">
          {Object.values(Category).map(cat => {
            const items = products.filter(p => p.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="bg-white rounded-[2.5rem] border border-brand-dark/5 shadow-premium overflow-hidden">
                <h3 className="bg-brand-dark/5 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">{cat}</h3>
                <div className="divide-y divide-brand-dark/5">
                  {items.map(product => (
                    <div key={product.id} className="flex items-center justify-between px-8 py-6">
                      <div className="pr-4">
                        <p className={`font-bold text-lg ${!product.available ? 'text-brand-dark/20 line-through' : 'text-brand-dark'}`}>{product.name}</p>
                        <p className="text-sm font-black text-brand-orange">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button disabled={loadingId === product.id} onClick={() => handleToggle(product.id)}
                          className={`min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase border transition-all ${product.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {loadingId === product.id ? <Loader2 className="animate-spin" size={14} /> : (product.available ? <CheckCircle size={14} /> : <XCircle size={14} />)}
                          {product.available ? 'No Ar' : 'Pausado'}
                        </button>
                        <button onClick={() => { if(window.confirm('Excluir?')) onDeleteProduct(product.id) }} className="p-3 text-brand-dark/10 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'ADD' && (
        <div className="bg-white rounded-[3rem] p-10 shadow-premium max-w-xl mx-auto w-full animate-fade-up">
           <form onSubmit={handleAdd} className="space-y-6">
             <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold" placeholder="Nome do Produto" required />
             <div className="grid grid-cols-2 gap-4">
               <input type="text" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold" placeholder="Preço" required />
               <select value={newCategory} onChange={e => setNewCategory(e.target.value as Category)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold">
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
             </div>
             <button type="submit" className="w-full bg-brand-orange text-white py-6 rounded-2xl font-black shadow-floating flex items-center justify-center gap-3"><Save size={20} /> Salvar</button>
           </form>
        </div>
      )}

      {activeTab === 'SECURITY' && (
        <div className="bg-white rounded-[3rem] p-10 shadow-premium max-w-xl mx-auto w-full animate-fade-up text-center">
           <form onSubmit={e => { e.preventDefault(); onUpdatePassword(newPassword); alert('Senha salva!'); setNewPassword(''); }} className="space-y-6">
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold text-center" placeholder="Nova Senha" required />
              <button type="submit" className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black shadow-lg">Atualizar Senha</button>
           </form>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;