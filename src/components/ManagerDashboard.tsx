import React from 'react';
import { Product, Category } from '../types';
import { formatCurrency } from '../utils';
import { ArrowLeft, CheckCircle, XCircle, LogOut } from 'lucide-react';

interface ManagerDashboardProps {
  products: Product[];
  onToggleAvailability: (id: string) => void;
  onLogout: () => void;
  onBack: () => void;
}

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
    </div>
  );
};

export default ManagerDashboard;