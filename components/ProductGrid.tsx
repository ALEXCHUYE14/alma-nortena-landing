"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, PackageX, ShoppingBag } from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/config";
import { useCarrito } from "@/components/CartProvider";

const UMBRAL_POCAS_UNIDADES = 5;

/* ============================================================
   Skeleton — se usa como fallback de <Suspense> en app/page.tsx
   ============================================================ */
export function ProductGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando productos"
      className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-amber-800/10 bg-white"
        >
          <div className="skeleton aspect-[4/5] w-full" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
      <span className="sr-only">Cargando la colección…</span>
    </div>
  );
}

/* ============================================================
   Tarjeta de producto
   ============================================================ */
function ProductCard({ producto, indice }: { producto: Producto; indice: number }) {
  const { agregarProducto } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  const pocasUnidades = producto.stock > 0 && producto.stock <= UMBRAL_POCAS_UNIDADES;
  const agotado = producto.stock === 0;

  const manejarAgregar = () => {
    if (agotado) return;
    agregarProducto(producto);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (indice % 4) * 0.07, duration: 0.45 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-amber-800/10 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-800/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={producto.imagen_url}
          alt={producto.nombre}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Badge dinámico */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
            agotado
              ? "bg-stone-900 text-stone-50"
              : pocasUnidades
                ? "bg-yellow-600 text-stone-900"
                : "bg-amber-800 text-stone-50"
          }`}
        >
          {agotado
            ? "Agotado"
            : pocasUnidades
              ? `¡Pocas unidades! (${producto.stock})`
              : "Envío gratis a Piura y Catacaos"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-yellow-600">
          {producto.categoria}
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-base leading-snug text-stone-900">
          {producto.nombre}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-stone-500">
          {producto.descripcion}
        </p>
        <p className="mt-2 text-lg font-semibold text-amber-800">
          {formatearPrecio(producto.precio)}
        </p>

        <button
          type="button"
          onClick={manejarAgregar}
          disabled={agotado}
          className={`mt-3 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all duration-200 ${
            agotado
              ? "cursor-not-allowed bg-stone-200 text-stone-400"
              : agregado
                ? "bg-yellow-600 text-stone-900"
                : "bg-amber-800 text-stone-50 hover:bg-amber-900 active:scale-[0.97]"
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
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingBag size={16} aria-hidden="true" />
              Añadir al carrito
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}

/* ============================================================
   Grid principal
   ============================================================ */
const TODAS_CATEGORIAS = "Todas";

export function ProductGrid({ productos }: { productos: Producto[] }) {
  const [categoria, setCategoria] = useState<string>(TODAS_CATEGORIAS);

  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-800/30 bg-white/60 p-10 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl text-stone-900">
          Estamos renovando la colección
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Muy pronto encontrarás nuevas piezas aquí. Escríbenos por WhatsApp
          para conocer las novedades antes que nadie.
        </p>
      </div>
    );
  }

  const categorias = [
    TODAS_CATEGORIAS,
    ...Array.from(new Set(productos.map((p) => p.categoria))),
  ];
  const productosFiltrados =
    categoria === TODAS_CATEGORIAS
      ? productos
      : productos.filter((p) => p.categoria === categoria);

  return (
    <div>
      {categorias.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              aria-pressed={categoria === c}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                categoria === c
                  ? "border-amber-800 bg-amber-800 text-stone-50"
                  : "border-amber-800/20 bg-white text-stone-900 hover:border-amber-800/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {productosFiltrados.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">
          No hay piezas en esta categoría por ahora.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {productosFiltrados.map((producto, i) => (
            <ProductCard key={producto.id} producto={producto} indice={i} />
          ))}
        </div>
      )}
    </div>
  );
}
