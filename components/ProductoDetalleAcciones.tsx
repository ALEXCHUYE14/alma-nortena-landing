"use client";

import { useState } from "react";
import { Check, Minus, PackageX, Plus, ShoppingBag } from "lucide-react";
import type { Producto } from "@/lib/types";
import { useCarrito } from "@/components/CartProvider";

export function ProductoDetalleAcciones({ producto }: { producto: Producto }) {
  const { agregarProducto } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const agotado = producto.stock === 0;

  const manejarAgregar = () => {
    if (agotado) return;
    for (let i = 0; i < cantidad; i += 1) {
      agregarProducto(producto);
    }
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1800);
  };

  return (
    <div>
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

      <button
        type="button"
        onClick={manejarAgregar}
        disabled={agotado}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 sm:w-auto sm:px-10 ${
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
            Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingBag size={16} aria-hidden="true" />
            Añadir al carrito
          </>
        )}
      </button>
    </div>
  );
}
