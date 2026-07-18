import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid, ProductGridSkeleton } from "@/components/ProductGrid";
import { LeadForm } from "@/components/LeadForm";
import { FAQ } from "@/components/FAQ";
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
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
              Nuestra colección
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
              Piezas seleccionadas para el diario, la oficina, el colegio y
              esos momentos especiales que quieres lucir distinta.
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
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
              Elegancia con esencia piurana
            </h2>
            <p className="mt-5 leading-relaxed text-stone-900/75">
              En GRC Bisutería creemos que verte bien no debería ser
              complicado ni costoso. Seleccionamos aretes, collares, pulseras
              y sets combinados pensados para la mujer real: para el diario,
              para el colegio, para la oficina y para esos eventos que quieres
              lucir distinta. Todo con una guía cercana por WhatsApp y envío
              el mismo día en Piura.
            </p>
          </div>
        </section>

        {/* ================= Preguntas frecuentes ================= */}
        <section id="preguntas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-8 text-center">
            <Filigrana className="mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
              Preguntas frecuentes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
              Todo lo que necesitas saber sobre pagos, envíos y cambios antes
              de tu compra.
            </p>
          </div>
          <FAQ />
        </section>

        {/* ================= Suscripción ================= */}
        <section id="suscripcion" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-8 text-center">
            <Filigrana className="mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
              Únete al Club GRC
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
