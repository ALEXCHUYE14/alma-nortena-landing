"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Heart,
  Minus,
  PackageX,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatearPrecio, porcentajeDescuento } from "@/lib/config";
import { useCarrito } from "@/components/CartProvider";
import { useFavoritos } from "@/components/FavoritesProvider";

interface QuickViewModalProps {
  producto: Producto;
  onCerrar: () => void;
}

export function QuickViewModal({ producto, onCerrar }: QuickViewModalProps) {
  const { agregarProducto } = useCarrito();
  const { esFavorito, alternarFavorito } = useFavoritos();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const agotado = producto.stock === 0;
  const descuento = porcentajeDescuento(producto);
  const favorito = esFavorito(producto.id);

  const manejarAgregar = () => {
    if (agotado) return;
    for (let i = 0; i < cantidad; i += 1) {
      agregarProducto(producto);
    }
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1600);
  };

  return (
    <>
      <motion.button
        key="quickview-overlay"
        type="button"
        aria-label="Cerrar vista rápida"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        className="fixed inset-0 z-[65] bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div
        key="quickview-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Vista rápida: ${producto.nombre}`}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="fixed inset-x-4 top-1/2 z-[65] mx-auto max-h-[88vh] max-w-2xl -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl sm:inset-x-auto"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-stone-500 shadow-sm hover:bg-white"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              sizes="(min-width: 640px) 40vw, 90vw"
              className="object-cover"
            />
            {agotado ? (
              <span className="absolute left-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-50 shadow-sm">
                Agotado
              </span>
            ) : (
              descuento !== null && (
                <span className="absolute left-3 top-3 rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-900 shadow-sm">
                  -{descuento}% dscto
                </span>
              )
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">
              {producto.categoria}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">
              {producto.nombre}
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <p className="text-xl font-bold text-amber-800">
                {formatearPrecio(producto.precio)}
              </p>
              {descuento !== null && producto.precio_original && (
                <p className="text-sm text-stone-400 line-through">
                  {formatearPrecio(producto.precio_original)}
                </p>
              )}
            </div>

            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-stone-600">
              {producto.descripcion}
            </p>

            <div className="mt-auto pt-5">
              {!agotado && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                    Cantidad
                  </span>
                  <div className="flex items-center gap-3 rounded-full border border-stone-300 px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      aria-label="Quitar una unidad"
                      className="text-stone-900 hover:text-amber-800"
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-stone-900">
                      {cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                      aria-label="Añadir una unidad"
                      className="text-stone-900 hover:text-amber-800"
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={manejarAgregar}
                  disabled={agotado}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    agotado
                      ? "cursor-not-allowed bg-stone-200 text-stone-400"
                      : agregado
                        ? "bg-yellow-600 text-stone-900"
                        : "bg-amber-800 text-stone-50 hover:bg-amber-900 active:scale-[0.98]"
                  }`}
                >
                  {agotado ? (
                    <>
                      <PackageX size={16} aria-hidden="true" />
                      Sin stock
                    </>
                  ) : agregado ? (
                    <>
                      <Check size={16} aria-hidden="true" />
                      Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} aria-hidden="true" />
                      Añadir al carrito
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => alternarFavorito(producto)}
                  aria-label={favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                  aria-pressed={favorito}
                  className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                    favorito
                      ? "border-amber-800 bg-amber-800 text-stone-50"
                      : "border-stone-300 text-stone-900 hover:border-amber-800"
                  }`}
                >
                  <Heart size={18} aria-hidden="true" fill={favorito ? "currentColor" : "none"} />
                </button>
              </div>

              <Link
                href={`/producto/${producto.id}`}
                onClick={onCerrar}
                className="mt-4 block text-center text-sm font-medium text-amber-800 underline underline-offset-4"
              >
                Ver detalles completos
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
