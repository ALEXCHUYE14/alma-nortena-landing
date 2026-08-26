import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gem, Heart, MapPin, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Filigrana } from "@/components/Filigrana";
import { CraftsmanshipVideo } from "@/components/CraftsmanshipVideo";
import { IconoWhatsApp } from "@/components/IconoWhatsApp";
import { siteConfig, urlWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description: `Conoce la historia y los valores detrás de ${siteConfig.nombre}, bisutería moderna y accesible con esencia piurana.`,
};

const VALORES = [
  {
    Icono: Heart,
    titulo: "Accesible sin dejar de ser elegante",
    detalle:
      "Creemos que verte bien no debería ser complicado ni costoso. Piezas pensadas para el diario, no solo para ocasiones especiales.",
  },
  {
    Icono: Gem,
    titulo: "Calidad revisada a mano",
    detalle:
      "Cada pieza pasa por nuestras manos antes de llegar a las tuyas: acabados, cierres y brillo, uno por uno.",
  },
  {
    Icono: MapPin,
    titulo: "Esencia piurana",
    detalle:
      "Nacimos en Piura y seguimos aquí: entendemos lo que busca la mujer del norte del Perú porque somos parte de esa comunidad.",
  },
  {
    Icono: ShieldCheck,
    titulo: "Cercanía real",
    detalle:
      "Sin formularios largos ni bots: una asesora real te acompaña por WhatsApp antes, durante y después de tu compra.",
  },
] as const;

export default function PaginaNuestraHistoria() {
  return (
    <>
      <Navbar />

      <main className="pt-32 lg:pt-44">
        {/* ================= Portada ================= */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Filigrana className="mb-6" />
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
                Elegancia con esencia piurana
              </h1>
              <p className="mt-5 leading-relaxed text-stone-600">
                {siteConfig.nombre} nació de una idea simple: la mujer real
                —la que va a la oficina, al colegio, a la reunión familiar o
                a esa cita que la tiene nerviosa— merece accesorios bonitos
                sin tener que pagar de más ni cruzar la ciudad para
                conseguirlos.
              </p>
              <p className="mt-4 leading-relaxed text-stone-600">
                Seleccionamos cada arete, collar, pulsera y anillo pensando
                en piezas que combinen con lo que ya tienes en tu clóset:
                versátiles para el día a día, con ese detalle que te hace
                sentir distinta. Nada de vitrinas intimidantes ni vendedoras
                apuradas — solo una asesora real, por WhatsApp, dispuesta a
                ayudarte a encontrar justo lo que buscas.
              </p>
              <p className="mt-4 leading-relaxed text-stone-600">
                Somos de Piura y trabajamos para Piura: envío el mismo día
                dentro de la ciudad y una atención cercana que no vas a
                encontrar en una tienda genérica.
              </p>

              <a
                href={urlWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-800 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
              >
                <IconoWhatsApp size={18} />
                Conversemos por WhatsApp
              </a>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl shadow-amber-800/10">
              <Image
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=80"
                alt="Bisutería moderna de GRC Bisutería, collar delicado"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ================= Valores ================= */}
        <section className="textura-toquilla py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <Filigrana className="mb-6" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
                Lo que nos guía
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALORES.map(({ Icono, titulo, detalle }) => (
                <div
                  key={titulo}
                  className="rounded-2xl border border-amber-800/15 bg-white p-6 text-center"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-800/10 text-amber-800">
                    <Icono size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-stone-900">
                    {titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {detalle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Artesanía ================= */}
        <section className="py-16 lg:py-24">
          <CraftsmanshipVideo />
        </section>

        {/* ================= CTA final ================= */}
        <section className="mx-auto max-w-2xl px-4 pb-20 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900">
            ¿Lista para encontrar tu próxima pieza favorita?
          </h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/#coleccion"
              className="inline-flex items-center justify-center rounded-full bg-amber-800 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-50 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-900"
            >
              Ver colección
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border-2 border-amber-800 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-800 transition-all duration-200 hover:bg-amber-800/5"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
