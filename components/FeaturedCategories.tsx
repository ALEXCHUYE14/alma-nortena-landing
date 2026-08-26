import Image from "next/image";
import Link from "next/link";
import { Filigrana } from "@/components/Filigrana";
import { createClient } from "@/lib/supabase/server";

interface CategoriaDestacada {
  nombre: string;
  imagen_url: string;
}

/**
 * Entrada visual a cada categoría, usando una foto real de un producto
 * de esa categoría (no imágenes genéricas ni inventadas). Si Supabase
 * no responde o el catálogo tiene menos de 2 categorías, la sección
 * completa se omite en vez de mostrarse vacía o rota.
 */
export async function FeaturedCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("categoria, imagen_url, created_at")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return null;

  const categorias: CategoriaDestacada[] = [];
  const vistas = new Set<string>();
  for (const producto of data) {
    if (vistas.has(producto.categoria)) continue;
    vistas.add(producto.categoria);
    categorias.push({ nombre: producto.categoria, imagen_url: producto.imagen_url });
  }

  if (categorias.length < 2) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:pt-24">
      <div className="mb-8 text-center">
        <Filigrana className="mb-6" />
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
          Explora por categoría
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categorias.map(({ nombre, imagen_url }) => (
          <Link
            key={nombre}
            href={`/?categoria=${encodeURIComponent(nombre)}#coleccion`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src={imagen_url}
              alt={nombre}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-4 text-center font-[family-name:var(--font-display)] text-lg font-bold text-stone-50">
              {nombre}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
