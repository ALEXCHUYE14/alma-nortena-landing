"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Heart, PackageX, ShoppingBag } from "lucide-react";
import type { Producto } from "@/lib/types";
import { formatearPrecio, porcentajeDescuento } from "@/lib/config";
import { useCarrito } from "@/components/CartProvider";
import { useFavoritos } from "@/components/FavoritesProvider";
import { QuickViewModal } from "@/components/QuickViewModal";

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
function ProductCard({
  producto,
  indice,
  onVistaRapida,
}: {
  producto: Producto;
  indice: number;
  onVistaRapida: (producto: Producto) => void;
}) {
  const { agregarProducto } = useCarrito();
  const { esFavorito, alternarFavorito } = useFavoritos();
  const [agregado, setAgregado] = useState(false);

  const pocasUnidades = producto.stock > 0 && producto.stock <= UMBRAL_POCAS_UNIDADES;
  const agotado = producto.stock === 0;
  const descuento = porcentajeDescuento(producto);
  const favorito = esFavorito(producto.id);

  const manejarAgregar = () => {
    if (agotado) return;
    agregarProducto(producto);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1600);
  };

  const manejarFavorito = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alternarFavorito(producto);
  };

  const manejarVistaRapida = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onVistaRapida(producto);
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

          {/* Favoritos + vista rápida */}
          <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={manejarFavorito}
              aria-label={favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
              aria-pressed={favorito}
              className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${
                favorito
                  ? "bg-amber-800 text-stone-50"
                  : "bg-white/90 text-stone-900 hover:bg-white"
              }`}
            >
              <Heart size={15} aria-hidden="true" fill={favorito ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={manejarVistaRapida}
              aria-label="Vista rápida"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Eye size={15} aria-hidden="true" />
            </button>
          </div>
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
type Orden = "recientes" | "precio_asc" | "precio_desc";

export function ProductGrid({ productos }: { productos: Producto[] }) {
  const [categoria, setCategoria] = useState<string>(TODAS_CATEGORIAS);
  const [orden, setOrden] = useState<Orden>("recientes");
  const [precioMax, setPrecioMax] = useState<number | null>(null);
  const [productoVistaRapida, setProductoVistaRapida] = useState<Producto | null>(null);

  const precios = productos.map((p) => p.precio);
  const precioMinCatalogo = precios.length ? Math.floor(Math.min(...precios)) : 0;
  const precioMaxCatalogo = precios.length ? Math.ceil(Math.max(...precios)) : 0;
  const precioMaxActivo = precioMax ?? precioMaxCatalogo;

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

  const productosFiltrados = productos
    .filter((p) => categoria === TODAS_CATEGORIAS || p.categoria === categoria)
    .filter((p) => p.precio <= precioMaxActivo)
    .sort((a, b) => {
      if (orden === "precio_asc") return a.precio - b.precio;
      if (orden === "precio_desc") return b.precio - a.precio;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div>
      {categorias.length > 2 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
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

      <div className="mb-8 flex flex-col items-center justify-between gap-4 border-y border-amber-800/10 py-4 sm:flex-row">
        <label className="flex items-center gap-2 text-xs text-stone-600">
          <span className="font-bold uppercase tracking-wider text-stone-500">
            Ordenar
          </span>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 focus:border-amber-800 focus:outline-none"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
          </select>
        </label>

        {precioMinCatalogo < precioMaxCatalogo && (
          <label className="flex w-full items-center gap-3 text-xs text-stone-600 sm:w-64">
            <span className="shrink-0 font-bold uppercase tracking-wider text-stone-500">
              Hasta {formatearPrecio(precioMaxActivo)}
            </span>
            <input
              type="range"
              min={precioMinCatalogo}
              max={precioMaxCatalogo}
              value={precioMaxActivo}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-amber-800"
              aria-label="Filtrar por precio máximo"
            />
          </label>
        )}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">
          No hay piezas que coincidan con estos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {productosFiltrados.map((producto, i) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              indice={i}
              onVistaRapida={setProductoVistaRapida}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {productoVistaRapida && (
          <QuickViewModal
            producto={productoVistaRapida}
            onCerrar={() => setProductoVistaRapida(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
