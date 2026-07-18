import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductoDetalleAcciones } from "@/components/ProductoDetalleAcciones";
import { createClient } from "@/lib/supabase/server";
import { formatearPrecio, porcentajeDescuento, siteConfig } from "@/lib/config";
import type { Producto } from "@/lib/types";

export const revalidate = 60;

interface PaginaProductoProps {
  params: Promise<{ id: string }>;
}

async function obtenerProducto(id: string): Promise<Producto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Producto;
}

export async function generateMetadata({
  params,
}: PaginaProductoProps): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerProducto(id);

  if (!producto) return {};

  return {
    title: producto.nombre,
    description: producto.descripcion || siteConfig.descripcion,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion || siteConfig.descripcion,
      images: [{ url: producto.imagen_url }],
    },
  };
}

export default async function PaginaProducto({ params }: PaginaProductoProps) {
  const { id } = await params;
  const producto = await obtenerProducto(id);

  if (!producto) notFound();

  const descuento = porcentajeDescuento(producto);
  const agotado = producto.stock === 0;

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:pt-44">
        <nav aria-label="Ruta de navegación" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-amber-800">
            Inicio
          </Link>
          <span>/</span>
          <span>{producto.categoria}</span>
          <span>/</span>
          <span className="text-stone-900">{producto.nombre}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />

            {agotado ? (
              <span className="absolute left-4 top-4 rounded-full bg-stone-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-50 shadow-sm">
                Agotado
              </span>
            ) : (
              descuento !== null && (
                <span className="absolute left-4 top-4 rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-900 shadow-sm">
                  -{descuento}% dscto
                </span>
              )
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">
              {producto.categoria}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900 sm:text-3xl">
              {producto.nombre}
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              SKU: {producto.id.slice(0, 8).toUpperCase()}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-2xl font-bold text-amber-800">
                {formatearPrecio(producto.precio)}
              </p>
              {descuento !== null && producto.precio_original && (
                <p className="text-base text-stone-400 line-through">
                  {formatearPrecio(producto.precio_original)}
                </p>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-stone-600">
              {producto.descripcion}
            </p>

            <div className="mt-6">
              <ProductoDetalleAcciones producto={producto} />
            </div>

            <p className="mt-6 text-xs text-stone-400">
              Envío gratis el mismo día en Piura Metropolitana. Pagos con
              Yape, Plin o transferencia.
            </p>

            <Link
              href="/#coleccion"
              className="mt-6 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
            >
              ← Volver a la colección
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
