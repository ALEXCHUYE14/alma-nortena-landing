"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, PackageX, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Producto } from "@/lib/types";
import { formatearPrecio, porcentajeDescuento } from "@/lib/config";
import { useCarrito } from "@/components/CartProvider";
import { useComparar } from "@/components/CompareProvider";

interface CompareModalProps {
  productos: Producto[];
  onCerrar: () => void;
}

export function CompareModal({ productos, onCerrar }: CompareModalProps) {
  return (
    <>
      <motion.button
        key="compare-overlay"
        type="button"
        aria-label="Cerrar comparación"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
        className="fixed inset-0 z-[65] bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div
        key="compare-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Comparar productos"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="fixed inset-x-4 top-1/2 z-[65] mx-auto max-h-[88vh] max-w-4xl -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">
            Comparar productos
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {productos.map((producto) => (
            <ColumnaComparacion key={producto.id} producto={producto} />
          ))}
        </div>
      </motion.div>
    </>
  );
}

function ColumnaComparacion({ producto }: { producto: Producto }) {
  const { agregarProducto } = useCarrito();
  const { quitarDeComparacion } = useComparar();
  const [agregado, setAgregado] = useState(false);

  const agotado = producto.stock === 0;
  const descuento = porcentajeDescuento(producto);

  const manejarAgregar = () => {
    if (agotado) return;
    agregarProducto(producto);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1600);
  };

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={producto.imagen_url}
          alt={producto.nombre}
          fill
          sizes="(min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => quitarDeComparacion(producto.id)}
          aria-label={`Quitar ${producto.nombre} de la comparación`}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-500 shadow-sm hover:bg-white hover:text-red-600"
        >
          <Trash2 size={13} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-yellow-600">
        {producto.categoria}
      </p>
      <h3 className="mt-1 font-[family-name:var(--font-display)] text-sm font-medium leading-snug text-stone-900">
        {producto.nombre}
      </h3>

      <div className="mt-1.5 flex items-center gap-2">
        <p className="text-sm font-bold text-amber-800">{formatearPrecio(producto.precio)}</p>
        {descuento !== null && producto.precio_original && (
          <p className="text-xs text-stone-400 line-through">
            {formatearPrecio(producto.precio_original)}
          </p>
        )}
      </div>

      <p className="mt-2 text-xs text-stone-500">
        {agotado ? (
          <span className="font-semibold text-stone-900">Agotado</span>
        ) : (
          `${producto.stock} disponibles`
        )}
      </p>

      <button
        type="button"
        onClick={manejarAgregar}
        disabled={agotado}
        className={`mt-3 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
          agotado
            ? "cursor-not-allowed bg-stone-200 text-stone-400"
            : agregado
              ? "bg-yellow-600 text-stone-900"
              : "bg-amber-800 text-stone-50 hover:bg-amber-900"
        }`}
      >
        {agotado ? (
          <>
            <PackageX size={13} aria-hidden="true" />
            Sin stock
          </>
        ) : agregado ? (
          <>
            <Check size={13} aria-hidden="true" />
            Agregado
          </>
        ) : (
          <>
            <ShoppingBag size={13} aria-hidden="true" />
            Añadir
          </>
        )}
      </button>

      <Link
        href={`/producto/${producto.id}`}
        className="mt-2 text-center text-xs font-medium text-amber-800 underline underline-offset-4"
      >
        Ver detalles
      </Link>
    </div>
  );
}
