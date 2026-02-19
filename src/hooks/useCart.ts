import { useState, useMemo, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';

const STORAGE_KEY = '@casa-da-esfirra:cart-v1.0';

export const useCart = (products: Product[]) => {

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);


  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => {
      const product = products.find(p => p.id === id);
 
      if (!product || (!product.available && delta > 0)) return prev;
      
      const existingItem = prev.find(item => item.id === id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + delta;
        

        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== id);
        }

      
        return prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
      }

     
      if (delta > 0) {
        return [...prev, { ...product, quantity: 1 }];
      }

      return prev;
    });
  }, [products]); 


  const clearCart = useCallback(() => setCart([]), []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);


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
