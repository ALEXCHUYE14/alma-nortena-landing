import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Filigrana } from "@/components/Filigrana";
import { LibroReclamaciones } from "@/components/LibroReclamaciones";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description: `Libro de Reclamaciones Virtual de ${siteConfig.nombre}, conforme al Código de Protección y Defensa del Consumidor.`,
};

export default function PaginaLibroReclamaciones() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:pt-44">
        <div className="mb-10 text-center">
          <Filigrana className="mb-6" />
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
            Libro de Reclamaciones
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
            Estamos para escucharte. Completa el formulario y te
            responderemos a la brevedad.
          </p>
        </div>

        <LibroReclamaciones />
      </main>
      <Footer />
    </>
  );
}
