"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, X } from "lucide-react";
import { useComparar } from "@/components/CompareProvider";
import { CompareModal } from "@/components/CompareModal";

export function CompareBar() {
  const { comparar, quitarDeComparacion, vaciarComparacion } = useComparar();
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <>
      <AnimatePresence>
        {comparar.length > 0 && (
          <motion.div
            key="compare-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-20 border-t border-amber-800/15 bg-white shadow-[0_-4px_24px_-8px_rgba(28,25,23,0.15)]"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 pr-20 sm:px-6 sm:pr-24">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 sm:flex">
                  <Scale size={15} aria-hidden="true" />
                  Comparar
                </span>
                {comparar.map((producto) => (
                  <div key={producto.id} className="relative shrink-0">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
                      <Image
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarDeComparacion(producto.id)}
                      aria-label={`Quitar ${producto.nombre} de la comparación`}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-stone-50"
                    >
                      <X size={11} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={vaciarComparacion}
                  className="hidden text-xs font-medium text-stone-500 hover:text-stone-700 sm:block"
                >
                  Vaciar
                </button>
                <button
                  type="button"
                  onClick={() => setModalAbierto(true)}
                  disabled={comparar.length < 2}
                  className="rounded-full bg-amber-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Comparar ({comparar.length})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalAbierto && (
          <CompareModal productos={comparar} onCerrar={() => setModalAbierto(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
