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

interface CompararContexto {
  comparar: Producto[];
  enComparacion: (productoId: string) => boolean;
  alternarComparacion: (producto: Producto) => void;
  quitarDeComparacion: (productoId: string) => void;
  vaciarComparacion: () => void;
}

const CompareContext = createContext<CompararContexto | null>(null);

const CLAVE_ALMACENAMIENTO = "alma-nortena:comparar";
const MAXIMO_COMPARAR = 3;

function esProductoValido(valor: unknown): valor is Producto {
  if (!valor || typeof valor !== "object") return false;
  const producto = valor as Partial<Producto>;
  return typeof producto.id === "string" && typeof producto.nombre === "string";
}

function leerComparacionGuardada(): Producto[] {
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

export function CompareProvider({ children }: { children: ReactNode }) {
  const [comparar, setComparar] = useState<Producto[]>([]);
  const hidratado = useRef(false);

  useEffect(() => {
    setComparar(leerComparacionGuardada());
    hidratado.current = true;
  }, []);

  useEffect(() => {
    if (!hidratado.current || typeof window === "undefined") return;
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(comparar));
  }, [comparar]);

  const enComparacion = useCallback(
    (productoId: string) => comparar.some((p) => p.id === productoId),
    [comparar]
  );

  const alternarComparacion = useCallback((producto: Producto) => {
    setComparar((prev) => {
      const yaExiste = prev.some((p) => p.id === producto.id);
      if (yaExiste) return prev.filter((p) => p.id !== producto.id);
      if (prev.length >= MAXIMO_COMPARAR) return prev;
      return [...prev, producto];
    });
  }, []);

  const quitarDeComparacion = useCallback((productoId: string) => {
    setComparar((prev) => prev.filter((p) => p.id !== productoId));
  }, []);

  const vaciarComparacion = useCallback(() => setComparar([]), []);

  const valor = useMemo<CompararContexto>(
    () => ({
      comparar,
      enComparacion,
      alternarComparacion,
      quitarDeComparacion,
      vaciarComparacion,
    }),
    [comparar, enComparacion, alternarComparacion, quitarDeComparacion, vaciarComparacion]
  );

  return (
    <CompareContext.Provider value={valor}>{children}</CompareContext.Provider>
  );
}

export function useComparar(): CompararContexto {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useComparar debe usarse dentro de <CompareProvider>");
  }
  return ctx;
}

export { MAXIMO_COMPARAR };
