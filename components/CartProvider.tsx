"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ItemCarrito, Producto } from "@/lib/types";

interface CarritoContexto {
  items: ItemCarrito[];
  totalUnidades: number;
  totalSoles: number;
  agregarProducto: (producto: Producto) => void;
  quitarProducto: (productoId: string) => void;
  vaciarCarrito: () => void;
}

const CartContext = createContext<CarritoContexto | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  const agregarProducto = useCallback((producto: Producto) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) }
            : i
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  }, []);

  const quitarProducto = useCallback((productoId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
        )
        .filter((i) => i.cantidad > 0)
    );
  }, []);

  const vaciarCarrito = useCallback(() => setItems([]), []);

  const valor = useMemo<CarritoContexto>(() => {
    const totalUnidades = items.reduce((acc, i) => acc + i.cantidad, 0);
    const totalSoles = items.reduce(
      (acc, i) => acc + i.cantidad * i.producto.precio,
      0
    );
    return {
      items,
      totalUnidades,
      totalSoles,
      agregarProducto,
      quitarProducto,
      vaciarCarrito,
    };
  }, [items, agregarProducto, quitarProducto, vaciarCarrito]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCarrito(): CarritoContexto {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
