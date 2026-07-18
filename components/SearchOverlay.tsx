"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatearPrecio } from "@/lib/config";
import type { Producto } from "@/lib/types";

interface SearchOverlayProps {
  onCerrar: () => void;
}

export function SearchOverlay({ onCerrar }: SearchOverlayProps) {
  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [buscoAlgunaVez, setBuscoAlgunaVez] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const termino = consulta.trim();
    if (termino.length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    const idTimeout = window.setTimeout(async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .ilike("nombre", `%${termino}%`)
        .limit(8);

      if (!error) {
        setResultados((data ?? []) as Producto[]);
      }
      setBuscoAlgunaVez(true);
      setBuscando(false);
    }, 350);

    return () => window.clearTimeout(idTimeout);
  }, [consulta]);

  return (
    <>
      <motion.button
        key="search-overlay"
        type="button"
        aria-label="Cerrar búsqueda"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        className="fixed inset-0 z-[70] bg-stone-900/50 backdrop-blur-sm"
      />
      <motion.div
        key="search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar productos"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-x-0 top-0 z-[70] max-h-[85vh] overflow-y-auto bg-white shadow-2xl"
      >
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <Search size={20} className="shrink-0 text-amber-800" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Busca aretes, collares, pulseras…"
              className="w-full border-b border-stone-200 bg-transparent py-2 text-base text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-800"
            />
            {buscando && (
              <Loader2 size={18} className="shrink-0 animate-spin text-stone-400" aria-hidden="true" />
            )}
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="shrink-0 rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">
            {resultados.length > 0 ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {resultados.map((producto) => (
                  <li key={producto.id}>
                    <Link
                      href={`/producto/${producto.id}`}
                      onClick={onCerrar}
                      className="group block text-center"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
                        <Image
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          fill
                          sizes="(min-width: 640px) 25vw, 45vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 line-clamp-1 text-sm text-stone-900">
                        {producto.nombre}
                      </p>
                      <p className="text-sm font-bold text-amber-800">
                        {formatearPrecio(producto.precio)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              consulta.trim().length >= 2 &&
              buscoAlgunaVez &&
              !buscando && (
                <p className="py-6 text-center text-sm text-stone-500">
                  No encontramos productos para &ldquo;{consulta}&rdquo;. Prueba
                  con otra palabra o escríbenos por WhatsApp.
                </p>
              )
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
