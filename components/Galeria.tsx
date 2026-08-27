import Image from "next/image";
import { Filigrana } from "@/components/Filigrana";
import { siteConfig } from "@/lib/config";

/**
 * Fotografía real de la marca (no stock): 2 tomas de estilo/lookbook y 1
 * del empaque de regalo. Los archivos deben existir en `public/galeria/`
 * con estos nombres exactos; si alguno falta, Next.js solo mostrará ese
 * recuadro roto sin tumbar el resto de la página (no hay lógica que
 * dependa de que existan).
 */
const FOTOS = [
  {
    src: "/galeria/coleccion.jpeg",
    alt: `Selección de aretes, collares, pulseras y anillos de ${siteConfig.nombre} en tonos dorados y amatista`,
    leyenda: "Nuestra selección, lista para ti",
  },
  {
    src: "/galeria/detalle.jpeg",
    alt: "Detalle editorial de bisutería dorada con piedras, sobre superficie natural",
    leyenda: "Cada detalle, cuidado al máximo",
  },
  {
    src: "/galeria/empaque.jpeg",
    alt: `Collar y aretes de ${siteConfig.nombre} presentados en caja de regalo`,
    leyenda: "Así te llega: lista para regalar",
  },
] as const;

export function Galeria() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-10 text-center">
        <Filigrana className="mb-6" />
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
          Así es {siteConfig.nombre}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
          Fotos reales de nuestras piezas y del empaque con el que llega
          cada pedido.
        </p>
      </div>

      {/* Mismas proporciones que las tarjetas de "Nuestra colección"
          (aspect-[4/5], mismos gaps) para que se vean del mismo tamaño. */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3">
        {FOTOS.map(({ src, alt, leyenda }) => (
          <figure
            key={src}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-100 shadow-sm"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 33vw, 45vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5 text-xs font-medium text-stone-50 sm:text-sm">
              {leyenda}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
