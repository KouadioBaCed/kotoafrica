import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { calculateProductPrice, type ShippingMode } from '../utils/logistics';

export type PaymentMode = 'immediate' | 'delivery';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight_kg: number;
  volume_m3: number;
  shippingMode: ShippingMode; // Mode d'envoi spécifique à cet article
  paymentMode: PaymentMode; // Mode de paiement spécifique à cet article
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; image: string; weight_kg: number; volume_m3: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateShippingMode: (productId: string, shippingMode: ShippingMode) => void;
  updatePaymentMode: (productId: string, paymentMode: PaymentMode) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalPriceFCFA: () => number;
  getTotalWeight: () => number;
  getTotalVolume: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Charger le panier depuis localStorage au démarrage
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];

    // Migrer les anciens items qui n'ont pas shippingMode et paymentMode
    const parsedCart: CartItem[] = JSON.parse(savedCart);
    return parsedCart.map((item) => ({
      ...item,
      shippingMode: item.shippingMode || 'air_rapide',
      paymentMode: item.paymentMode || 'immediate',
    }));
  });

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: { id: string; name: string; price: number; image: string; weight_kg: number; volume_m3: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Mode d'envoi par défaut : air_rapide, paiement par défaut : immediate
      return [...prevItems, { ...product, quantity: 1, shippingMode: 'air_rapide' as ShippingMode, paymentMode: 'immediate' as PaymentMode }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateShippingMode = (productId: string, shippingMode: ShippingMode) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, shippingMode } : item
      )
    );
  };

  const updatePaymentMode = (productId: string, paymentMode: PaymentMode) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, paymentMode } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalPriceFCFA = () => {
    // Calculer le total en USD
    const totalUSD = items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Appliquer la formule sur le total du panier
    // Formule: ((total_USD × taux_change) + 70 FCFA) × 1.10
    return calculateProductPrice(totalUSD);
  };

  const getTotalWeight = () => {
    return items.reduce((total, item) => total + item.weight_kg * item.quantity, 0);
  };

  const getTotalVolume = () => {
    return items.reduce((total, item) => total + item.volume_m3 * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateShippingMode,
        updatePaymentMode,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getTotalPriceFCFA,
        getTotalWeight,
        getTotalVolume,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
