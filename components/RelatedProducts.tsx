import { RelatedProductsGrid } from "@/components/RelatedProductsGrid";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/lib/types";

interface RelatedProductsProps {
  categoria: string;
  idExcluido: string;
}

/**
 * "También te puede gustar": otras piezas reales de la misma
 * categoría. Si no hay ninguna otra pieza disponible, la sección no
 * se renderiza (evita un bloque vacío al final de la ficha).
 */
export async function RelatedProducts({ categoria, idExcluido }: RelatedProductsProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("categoria", categoria)
    .neq("id", idExcluido)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data || data.length === 0) return null;

  return (
    <section className="mt-14 border-t border-amber-800/10 pt-10">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">
        También te puede gustar
      </h2>
      <div className="mt-6">
        <RelatedProductsGrid productos={data as Producto[]} />
      </div>
    </section>
  );
}
