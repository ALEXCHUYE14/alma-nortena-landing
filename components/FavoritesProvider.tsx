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

interface FavoritosContexto {
  favoritos: Producto[];
  totalFavoritos: number;
  esFavorito: (productoId: string) => boolean;
  alternarFavorito: (producto: Producto) => void;
  quitarFavorito: (productoId: string) => void;
}

const FavoritesContext = createContext<FavoritosContexto | null>(null);

const CLAVE_ALMACENAMIENTO = "alma-nortena:favoritos";

function esProductoValido(valor: unknown): valor is Producto {
  if (!valor || typeof valor !== "object") return false;
  const producto = valor as Partial<Producto>;
  return typeof producto.id === "string" && typeof producto.nombre === "string";
}

function leerFavoritosGuardados(): Producto[] {
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

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<Producto[]>([]);
  const hidratado = useRef(false);

  // Cargar los favoritos guardados una vez montado en el navegador
  // (evita desajustes de hidratación entre servidor y cliente).
  useEffect(() => {
    setFavoritos(leerFavoritosGuardados());
    hidratado.current = true;
  }, []);

  // Persistir cada cambio, saltando el primer render (previo a hidratar).
  useEffect(() => {
    if (!hidratado.current || typeof window === "undefined") return;
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(favoritos));
  }, [favoritos]);

  const esFavorito = useCallback(
    (productoId: string) => favoritos.some((p) => p.id === productoId),
    [favoritos]
  );

  const alternarFavorito = useCallback((producto: Producto) => {
    setFavoritos((prev) => {
      const yaExiste = prev.some((p) => p.id === producto.id);
      if (yaExiste) {
        return prev.filter((p) => p.id !== producto.id);
      }
      return [...prev, producto];
    });
  }, []);

  const quitarFavorito = useCallback((productoId: string) => {
    setFavoritos((prev) => prev.filter((p) => p.id !== productoId));
  }, []);

  const valor = useMemo<FavoritosContexto>(
    () => ({
      favoritos,
      totalFavoritos: favoritos.length,
      esFavorito,
      alternarFavorito,
      quitarFavorito,
    }),
    [favoritos, esFavorito, alternarFavorito, quitarFavorito]
  );

  return (
    <FavoritesContext.Provider value={valor}>{children}</FavoritesContext.Provider>
  );
}

export function useFavoritos(): FavoritosContexto {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavoritos debe usarse dentro de <FavoritesProvider>");
  }
  return ctx;
}
