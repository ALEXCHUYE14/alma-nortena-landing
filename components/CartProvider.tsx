"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const CLAVE_ALMACENAMIENTO = "alma-nortena:carrito";

function esItemCarritoValido(valor: unknown): valor is ItemCarrito {
  if (!valor || typeof valor !== "object") return false;
  const item = valor as Partial<ItemCarrito>;
  return (
    typeof item.cantidad === "number" &&
    !!item.producto &&
    typeof item.producto === "object" &&
    typeof item.producto.id === "string"
  );
}

function leerCarritoGuardado(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!crudo) return [];
    const datos: unknown = JSON.parse(crudo);
    return Array.isArray(datos) ? datos.filter(esItemCarritoValido) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const hidratado = useRef(false);

  // Cargar el carrito guardado una vez montado en el navegador
  // (evita desajustes de hidratación entre servidor y cliente).
  useEffect(() => {
    setItems(leerCarritoGuardado());
    hidratado.current = true;
  }, []);

  // Persistir cada cambio, saltando el primer render (previo a hidratar).
  useEffect(() => {
    if (!hidratado.current || typeof window === "undefined") return;
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(items));
  }, [items]);

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
