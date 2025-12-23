<<<<<<< HEAD
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { formatCurrency, generateId } from '../utils';
import { 
  ArrowLeft, CheckCircle, XCircle, Plus, 
  Trash2, List, Save, Lock, Loader2
} from 'lucide-react';

interface Props {
  products: Product[];
  onToggleAvailability: (id: string) => Promise<void>;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdatePassword: (newPassword: string) => void;
=======
import React from 'react';
import { Product, Category } from '../types';
import { formatCurrency } from '../utils';
import { ArrowLeft, CheckCircle, XCircle, LogOut } from 'lucide-react';

interface ManagerDashboardProps {
  products: Product[];
  onToggleAvailability: (id: string) => void;
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
  onLogout: () => void;
  onBack: () => void;
}

<<<<<<< HEAD
const ManagerDashboard: React.FC<Props> = ({ 
  products, onToggleAvailability, onAddProduct, onDeleteProduct,
  onUpdatePassword, onLogout, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'ADD' | 'SETTINGS'>('ITEMS');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.TRADICIONAL);
  const [pwdNew, setPwdNew] = useState('');

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    await onToggleAvailability(id);
    setLoadingId(null);
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
    setNewName(''); setNewPrice(''); setActiveTab('ITEMS');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-40">
      <div className="flex items-center justify-between mb-8 mt-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-brand-dark/10 text-brand-dark shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-serif font-black text-brand-dark tracking-tight">Gestão do Gênio</h2>
        </div>
        <button onClick={onLogout} className="text-xs font-black text-red-600 bg-red-50 px-6 py-3 rounded-2xl uppercase tracking-widest border border-red-100 transition-all">Sair</button>
      </div>

      <nav className="flex bg-brand-dark/5 p-2 rounded-[2rem] mb-10 shadow-inner">
        {[
          { id: 'ITEMS', label: 'Estoque', icon: List },
          { id: 'ADD', label: 'Novo Item', icon: Plus },
          { id: 'SETTINGS', label: 'Acesso', icon: Lock }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-brand-orange shadow-lg' : 'text-brand-dark/40 hover:text-brand-dark'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'ITEMS' && (
        <div className="space-y-6">
          {Object.values(Category).map(cat => {
            const items = products.filter(p => p.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="bg-white rounded-[2.5rem] border border-brand-dark/5 shadow-premium overflow-hidden">
                <h3 className="bg-brand-dark/5 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40 border-b border-brand-dark/5">{cat}</h3>
                <div className="divide-y divide-brand-dark/5">
                  {items.map(product => (
                    <div key={product.id} className="flex items-center justify-between px-8 py-6 hover:bg-brand-yellow/5 transition-colors">
                      <div>
                        <p className={`font-bold text-lg leading-tight ${!product.available ? 'text-brand-dark/20 line-through' : 'text-brand-dark'}`}>{product.name}</p>
                        <p className="text-sm font-black text-brand-orange mt-1">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          disabled={loadingId === product.id}
                          onClick={() => handleToggle(product.id)}
                          className={`min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                            product.available ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                          }`}
                        >
                          {loadingId === product.id ? <Loader2 className="animate-spin" size={14} /> : (product.available ? <CheckCircle size={14} /> : <XCircle size={14} />)}
                          {product.available ? 'No Ar' : 'Pausado'}
                        </button>
                        <button onClick={() => { if(window.confirm('Excluir?')) onDeleteProduct(product.id) }} className="p-3 text-brand-dark/10 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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
        <div className="bg-white rounded-[3rem] p-10 border border-brand-dark/5 shadow-premium max-w-xl mx-auto w-full animate-fade-up">
           <h3 className="text-2xl font-serif font-black text-brand-dark mb-8 text-center">Novo Sabor</h3>
           <form onSubmit={handleAdd} className="space-y-6">
             <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold text-brand-dark" placeholder="Nome" required />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input type="text" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold text-brand-dark" placeholder="Preço" required />
               <select value={newCategory} onChange={e => setNewCategory(e.target.value as Category)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold text-brand-dark cursor-pointer appearance-none">
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
             </div>
             <button type="submit" className="w-full bg-brand-orange text-white py-6 rounded-2xl font-black shadow-floating flex items-center justify-center gap-3 hover:bg-brand-dark transition-all transform hover:scale-[1.02] active:scale-95">
               <Save size={20} /> Salvar no Cardápio
             </button>
           </form>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-[3rem] p-10 border border-brand-dark/5 shadow-premium max-w-xl mx-auto w-full animate-fade-up">
           <h3 className="text-2xl font-serif font-black text-brand-dark mb-8 text-center">Segurança</h3>
           <form onSubmit={e => { e.preventDefault(); onUpdatePassword(pwdNew); alert('Senha salva!'); setPwdNew(''); }} className="space-y-6">
              <input type="password" value={pwdNew} onChange={e => setPwdNew(e.target.value)} className="w-full p-5 rounded-2xl bg-brand-dark/5 outline-none font-bold text-brand-dark text-center" placeholder="Nova Senha" required />
              <button type="submit" className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black shadow-lg hover:bg-black transition-all">Atualizar Acesso</button>
           </form>
        </div>
      )}
=======
const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  products, 
  onToggleAvailability, 
  onLogout,
  onBack 
}) => {
  
  // Agrupar produtos por categoria
  const groupedMenu: Partial<Record<Category, Product[]>> = {};
  Object.values(Category).forEach(cat => {
    groupedMenu[cat] = products.filter(item => item.category === cat);
  });

  return (
    <div className="max-w-3xl mx-auto pt-6 px-4 pb-32 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Controle de Estoque</h2>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 bg-red-50 px-4 py-2 rounded-full transition-colors self-start md:self-auto"
        >
          <LogOut size={16} /> Sair do Gerente
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Como funciona:</strong> Clique nos botões para ativar ou desativar a disponibilidade dos produtos no cardápio do cliente. As alterações são salvas automaticamente.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="bg-gray-50 px-6 py-3 border-b border-gray-100 text-lg font-bold text-gray-700">
              {category}
            </h3>
            <div className="divide-y divide-gray-50">
              {items?.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="pr-4">
                    <p className={`font-semibold ${!product.available ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                  
                  <button
                    onClick={() => onToggleAvailability(product.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm
                      ${product.available 
                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'}
                    `}
                  >
                    {product.available ? (
                      <>
                        <CheckCircle size={16} /> Ativo
                      </>
                    ) : (
                      <>
                        <XCircle size={16} /> Esgotado
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
>>>>>>> f89f84f67b0cc1ab83112c742b0c62d37fea6a95
    </div>
  );
};

export default ManagerDashboard;