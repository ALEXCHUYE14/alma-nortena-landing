import { Star } from "lucide-react";
import { Filigrana } from "@/components/Filigrana";
import { createClient } from "@/lib/supabase/server";

interface ResenaConProducto {
  id: string;
  nombre: string;
  calificacion: number;
  comentario: string;
  productos: { nombre: string } | { nombre: string }[] | null;
}

function nombreProducto(fila: ResenaConProducto): string | null {
  const relacion = fila.productos;
  if (!relacion) return null;
  return Array.isArray(relacion) ? (relacion[0]?.nombre ?? null) : relacion.nombre;
}

/**
 * Testimonios reales de clientas (reseñas aprobadas), no inventados.
 * Si todavía no hay ninguna reseña aprobada —o la tabla `resenas` aún
 * no fue creada en Supabase—, la sección completa no se renderiza:
 * es preferible omitirla a mostrar contenido vacío o falso.
 */
export async function Testimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resenas")
    .select("id, nombre, calificacion, comentario, productos(nombre)")
    .eq("aprobado", true)
    .order("calificacion", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !data || data.length === 0) return null;

  const testimonios = data as unknown as ResenaConProducto[];

  return (
    <section className="textura-toquilla py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <Filigrana className="mb-6" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
            Lo que dicen nuestras clientas
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
            Reseñas reales, verificadas antes de publicarse.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonios.map((resena) => (
            <figure
              key={resena.id}
              className="flex flex-col rounded-2xl border border-amber-800/15 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={15}
                    className={n <= resena.calificacion ? "text-yellow-600" : "text-stone-200"}
                    fill={n <= resena.calificacion ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
                &ldquo;{resena.comentario}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-stone-100 pt-3">
                <p className="text-sm font-semibold text-stone-900">{resena.nombre}</p>
                {nombreProducto(resena) && (
                  <p className="text-xs text-stone-400">Compró: {nombreProducto(resena)}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
