import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid, ProductGridSkeleton } from "@/components/ProductGrid";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";
import { Filigrana } from "@/components/Filigrana";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/lib/types";

// Revalidación incremental: los productos se refrescan cada 60 segundos
// sin sacrificar el renderizado estático inicial (ISR).
export const revalidate = 60;

/**
 * Sub-árbol asíncrono: al envolverlo en <Suspense>, Next.js hace
 * streaming del resto de la página mientras Supabase responde,
 * y el usuario ve los skeletons del grid en el intervalo.
 */
async function ColeccionProductos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error al cargar productos desde Supabase:", error.message);
    return <ProductGrid productos={[]} />;
  }

  return <ProductGrid productos={(data ?? []) as Producto[]} />;
}

export default function PaginaInicio() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* ================= Colección ================= */}
        <section id="coleccion" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <Filigrana className="mb-6" />
          <div className="mb-10 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900 sm:text-4xl">
              Nuestra colección
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
              Piezas seleccionadas para el clima y el estilo del norte:
              frescura, brillo y tradición en cada detalle.
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ColeccionProductos />
          </Suspense>
        </section>

        {/* ================= Historia ================= */}
        <section id="nosotras" className="textura-toquilla py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Filigrana className="mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900 sm:text-4xl">
              Del taller de Catacaos a tu puerta
            </h2>
            <p className="mt-5 leading-relaxed text-stone-900/75">
              Cada pieza de filigrana que ves aquí nació en un taller de la
              Calle Comercio, donde los orfebres de Catacaos llevan
              generaciones convirtiendo hilos de plata en encaje. Nosotras
              seleccionamos esas joyas, las combinamos con moda fresca pensada
              para el sol piurano y te las llevamos hasta tu casa, el mismo
              día, sin costo. Comprarle a Alma Norteña es vestirse bien y, al
              mismo tiempo, sostener las manos que mantienen viva nuestra
              tradición.
            </p>
          </div>
        </section>

        {/* ================= Suscripción ================= */}
        <section id="suscripcion" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-8 text-center">
            <Filigrana className="mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900 sm:text-4xl">
              Únete al Club Alma
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
              Preventas, descuentos exclusivos y novedades de la colección,
              directo a tu correo antes que a nadie.
            </p>
          </div>
          <LeadForm />
        </section>
      </main>

      <Footer />
    </>
  );
}
