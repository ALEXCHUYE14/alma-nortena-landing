"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { formatearPrecio, urlWhatsAppFavoritos } from "@/lib/config";
import { useCarrito } from "@/components/CartProvider";
import { useFavoritos } from "@/components/FavoritesProvider";

export function FavoritesPage() {
  const { favoritos, quitarFavorito } = useFavoritos();
  const { agregarProducto } = useCarrito();

  if (favoritos.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 pb-20 text-center sm:px-6">
        <Heart size={40} className="mx-auto text-amber-800/30" aria-hidden="true" />
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900">
          Aún no tienes favoritos
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Toca el corazón en cualquier producto de la colección para
          guardarlo aquí y verlo más tarde.
        </p>
        <Link
          href="/#coleccion"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-800 px-7 py-3 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900"
        >
          Ver la colección
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900 sm:text-3xl">
          Tus favoritos
        </h1>
        <a
          href={urlWhatsAppFavoritos(favoritos)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-amber-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Consultar todos por WhatsApp
        </a>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {favoritos.map((producto) => {
          const agotado = producto.stock === 0;
          return (
            <li key={producto.id} className="flex flex-col">
              <Link href={`/producto/${producto.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600">
                    {producto.categoria}
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-sm font-medium leading-snug text-stone-900">
                    {producto.nombre}
                  </h2>
                  <p className="mt-1 text-base font-bold text-amber-800">
                    {formatearPrecio(producto.precio)}
                  </p>
                </div>
              </Link>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => !agotado && agregarProducto(producto)}
                  disabled={agotado}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    agotado
                      ? "cursor-not-allowed bg-stone-200 text-stone-400"
                      : "bg-amber-800 text-stone-50 hover:bg-amber-900"
                  }`}
                >
                  <ShoppingBag size={13} aria-hidden="true" />
                  {agotado ? "Sin stock" : "Añadir"}
                </button>
                <button
                  type="button"
                  onClick={() => quitarFavorito(producto.id)}
                  aria-label={`Quitar ${producto.nombre} de favoritos`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition-colors hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
