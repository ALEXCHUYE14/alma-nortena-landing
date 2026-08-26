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
import type { Producto } from "@/lib/types";

interface VistosContexto {
  vistos: Producto[];
  registrarVisto: (producto: Producto) => void;
}

const RecentlyViewedContext = createContext<VistosContexto | null>(null);

const CLAVE_ALMACENAMIENTO = "alma-nortena:vistos";
const MAXIMO_VISTOS = 10;

function esProductoValido(valor: unknown): valor is Producto {
  if (!valor || typeof valor !== "object") return false;
  const producto = valor as Partial<Producto>;
  return typeof producto.id === "string" && typeof producto.nombre === "string";
}

function leerVistosGuardados(): Producto[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!crudo) return [];
    const datos: unknown = JSON.parse(crudo);
    return Array.isArray(datos) ? datos.filter(esProductoValido) : [];
  } catch {
    return [];
  }
}

/**
 * "Vistos recientemente": recuerda, solo en el navegador de cada
 * visitante (no se envía a ningún servidor), las últimas piezas que
 * abrió — la misma lógica de persistencia que carrito y favoritos.
 */
export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [vistos, setVistos] = useState<Producto[]>([]);
  const hidratado = useRef(false);

  useEffect(() => {
    setVistos(leerVistosGuardados());
    hidratado.current = true;
  }, []);

  useEffect(() => {
    if (!hidratado.current || typeof window === "undefined") return;
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(vistos));
  }, [vistos]);

  const registrarVisto = useCallback((producto: Producto) => {
    setVistos((prev) => {
      const sinEsteProducto = prev.filter((p) => p.id !== producto.id);
      return [producto, ...sinEsteProducto].slice(0, MAXIMO_VISTOS);
    });
  }, []);

  const valor = useMemo<VistosContexto>(
    () => ({ vistos, registrarVisto }),
    [vistos, registrarVisto]
  );

  return (
    <RecentlyViewedContext.Provider value={valor}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useVistosRecientemente(): VistosContexto {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    throw new Error(
      "useVistosRecientemente debe usarse dentro de <RecentlyViewedProvider>"
    );
  }
  return ctx;
}
