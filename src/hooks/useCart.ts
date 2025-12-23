// hooks/useCart.ts
import { useState, useMemo, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';

const STORAGE_KEY = '@casa-da-esfirra:cart-v1.0';

export const useCart = (products: Product[]) => {
  // 1. Persistência: Inicializa o estado com o que estiver no LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Sincronização: Salva no storage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // 3. Performance: useCallback evita que esta função seja recriada 
  // e cause re-renders desnecessários nos componentes de item.
  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => {
      const product = products.find(p => p.id === id);
      
      // Early return para produto não encontrado ou indisponível
      if (!product || (!product.available && delta > 0)) return prev;
      
      const existingItem = prev.find(item => item.id === id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + delta;
        
        // Se a quantidade for 0 ou menor, remove do carrinho
        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== id);
        }

        // Atualiza apenas o item necessário (Imutabilidade)
        return prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
      }

      // Se for um novo item e estivermos adicionando
      if (delta > 0) {
        return [...prev, { ...product, quantity: 1 }];
      }

      return prev;
    });
  }, [products]); // Depende de products para validar disponibilidade

  // 4. Utilitários: Funções extras que facilitam a vida na UI
  const clearCart = useCallback(() => setCart([]), []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  // 5. Memoização de Cálculos: Evita recalculcar em qualquer re-render lateral
  const cartStats = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const isEmpty = cart.length === 0;

    return { 
      subtotal, 
      totalItems, 
      isEmpty,
      formattedSubtotal: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(subtotal)
    };
  }, [cart]);

  return { 
    cart, 
    handleUpdateQuantity, 
    removeItem, 
    clearCart,
    ...cartStats 
  };
};