"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, PackageX, ShoppingBag } from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatearPrecio, porcentajeDescuento } from "@/lib/config";
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
        <div key={i}>
          <div className="skeleton aspect-[4/5] w-full rounded-xl" />
          <div className="mt-3 space-y-2">
            <div className="skeleton mx-auto h-3 w-1/2 rounded" />
            <div className="skeleton mx-auto h-4 w-2/3 rounded" />
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
  const descuento = porcentajeDescuento(producto);

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
      className="group flex flex-col"
    >
      <Link href={`/producto/${producto.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badge de stock */}
          <span
            className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
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
                ? `Pocas unidades (${producto.stock})`
                : "Envío gratis"}
          </span>

          {/* Badge de descuento (solo si hay precio_original real) */}
          {descuento !== null && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-blush px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-stone-900 shadow-sm">
              -{descuento}%
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-1 flex-col text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600">
            {producto.categoria}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-sm font-medium leading-snug text-stone-900">
            {producto.nombre}
          </h3>
          <div className="mt-1 flex items-center justify-center gap-2">
            <p className="text-base font-bold text-amber-800">
              {formatearPrecio(producto.precio)}
            </p>
            {descuento !== null && producto.precio_original && (
              <p className="text-xs text-stone-400 line-through">
                {formatearPrecio(producto.precio_original)}
              </p>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={manejarAgregar}
        disabled={agotado}
        className={`mt-3 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
          agotado
            ? "cursor-not-allowed bg-stone-200 text-stone-400"
            : agregado
              ? "bg-yellow-600 text-stone-900"
              : "bg-amber-800 text-stone-50 hover:bg-amber-900 active:scale-[0.97]"
        }`}
      >
        {agotado ? (
          <>
            <PackageX size={14} aria-hidden="true" />
            Sin stock
          </>
        ) : agregado ? (
          <>
            <Check size={14} aria-hidden="true" />
            Agregado
          </>
        ) : (
          <>
            <ShoppingBag size={14} aria-hidden="true" />
            Añadir
          </>
        )}
      </button>
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
              className={`rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
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
