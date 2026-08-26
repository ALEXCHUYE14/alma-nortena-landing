import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RelatedProductsGrid } from "@/components/RelatedProductsGrid";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";
import type { Producto } from "@/lib/types";

export const metadata: Metadata = {
  title: "Una selección para ti",
  description: `Alguien compartió contigo esta selección de piezas de ${siteConfig.nombre}.`,
  robots: { index: false, follow: true },
};

interface PaginaCompartirProps {
  searchParams: Promise<{ ids?: string }>;
}

function idsValidos(crudo: string | undefined): string[] {
  if (!crudo) return [];
  const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return crudo
    .split(",")
    .map((id) => id.trim())
    .filter((id) => REGEX_UUID.test(id));
}

export default async function PaginaCompartirFavoritos({
  searchParams,
}: PaginaCompartirProps) {
  const { ids } = await searchParams;
  const productoIds = idsValidos(ids);

  let productos: Producto[] = [];
  if (productoIds.length > 0) {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("*").in("id", productoIds);
    productos = (data ?? []) as Producto[];
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 lg:pt-44">
        <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="mb-10 text-center">
            <Heart size={32} className="mx-auto text-amber-800/40" aria-hidden="true" />
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900 sm:text-3xl">
              Una selección para ti
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
              Alguien pensó en ti al guardar estas piezas de {siteConfig.nombre}.
            </p>
          </div>

          {productos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-800/30 bg-white/60 p-10 text-center">
              <p className="text-sm text-stone-500">
                Este enlace ya no tiene piezas disponibles para mostrar.
              </p>
              <Link
                href="/#coleccion"
                className="mt-4 inline-block text-sm font-medium text-amber-800 underline underline-offset-4"
              >
                Ver la colección completa
              </Link>
            </div>
          ) : (
            <RelatedProductsGrid productos={productos} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
