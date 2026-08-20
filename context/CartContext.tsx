//context//CartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/products";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stockCount?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color: string, size: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
  shipping: number;
  tax: number;
}

const CartContext = createContext<CartContextType | null>(null);

const SHIPPING = 25; // Costo fijo de envío
const TAX_RATE = 0.18; // 18% IGV

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar carrito:", e);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, color: string, size: string, quantity: number) => {
    setItems((prev) => {
      // Buscar si ya existe el mismo producto con mismo color y talla
      const existing = prev.find(
        (item) =>
          item.productId === product.id &&
          item.color === color &&
          item.size === size
      );

      if (existing) {
        // Si existe, aumentar cantidad
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Si no existe, crear nuevo item
      const id = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      return [...prev, {
        id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color,
        size,
        quantity,
        stockCount: product.stockCount
      }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stockCount || 10) } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > 0 ? SHIPPING : 0;
  const total = subtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        total,
        shipping,
        tax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}