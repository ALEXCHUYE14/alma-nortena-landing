import { Filigrana } from "@/components/Filigrana";
import { TestimonialsCarousel, type TestimonioSimple } from "@/components/TestimonialsCarousel";
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
 *
 * El fetch se queda en este Server Component (no expone la consulta a
 * Supabase al cliente); el carrusel con autoplay vive aparte porque
 * necesita estado e interacción del navegador ("use client").
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

  const testimonios: TestimonioSimple[] = (data as unknown as ResenaConProducto[]).map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    calificacion: fila.calificacion,
    comentario: fila.comentario,
    producto: nombreProducto(fila),
  }));

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

        <TestimonialsCarousel testimonios={testimonios} />
      </div>
    </section>
  );
}
