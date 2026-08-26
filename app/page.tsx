import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { Combos } from "@/components/Combos";
import { ComoComprar } from "@/components/ComoComprar";
import { CraftsmanshipVideo } from "@/components/CraftsmanshipVideo";
import { Testimonials } from "@/components/Testimonials";
import { ProductGrid, ProductGridSkeleton } from "@/components/ProductGrid";
import { LeadForm } from "@/components/LeadForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Filigrana } from "@/components/Filigrana";
import { createClient } from "@/lib/supabase/server";
import { PREGUNTAS } from "@/lib/faq";
import type { Producto } from "@/lib/types";

// Mismas preguntas que se muestran en <FAQ />: una sola fuente de
// verdad para que el marcado FAQPage nunca quede desincronizado del
// contenido visible (Google puede mostrarlas como resultado enriquecido).
const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PREGUNTAS.map(({ pregunta, respuesta }) => ({
    "@type": "Question",
    name: pregunta,
    acceptedAnswer: { "@type": "Answer", text: respuesta },
  })),
};

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
        <TrustBar />

        {/* ================= Explora por categoría (se omite si no hay datos) ================= */}
        <Suspense fallback={null}>
          <FeaturedCategories />
        </Suspense>

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

        {/* ================= Arma tu set (se omite si no hay combos activos) ================= */}
        <Suspense fallback={null}>
          <Combos />
        </Suspense>

        {/* ================= Cómo comprar ================= */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-12 text-center">
            <Filigrana className="mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
              Cómo comprar
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
              Sin registros ni complicaciones: todo tu pedido, acompañado por
              una asesora real.
            </p>
          </div>
          <ComoComprar />
        </section>

        {/* ================= Historia ================= */}
        <section id="nosotras" className="textura-toquilla py-16 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl shadow-amber-800/10 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1620291699655-d958150a3ff8?w=900&q=80"
                alt="Mujer con un collar delicado de dije, look casual elegante"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="text-center lg:order-1 lg:text-left">
              <Filigrana className="mb-6 lg:justify-start" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
                Elegancia con esencia piurana
              </h2>
              <p className="mt-5 leading-relaxed text-stone-900/75">
                En GRC Bisutería creemos que verte bien no debería ser
                complicado ni costoso. Seleccionamos aretes, collares,
                pulseras y sets combinados pensados para la mujer real: para
                el diario, para el colegio, para la oficina y para esos
                eventos que quieres lucir distinta. Todo con una guía
                cercana por WhatsApp y envío el mismo día en Piura.
              </p>
              <Link
                href="/nuestra-historia"
                className="mt-5 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
              >
                Conoce nuestra historia completa →
              </Link>
            </div>
          </div>
        </section>

        {/* ================= Artesanía ================= */}
        <section className="py-16 lg:py-24">
          <CraftsmanshipVideo />
        </section>

        {/* ================= Testimonios (solo si hay reseñas reales) ================= */}
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>

        {/* ================= Preguntas frecuentes ================= */}
        <section id="preguntas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLdFAQ).replace(/</g, "\\u003c"),
            }}
          />
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
