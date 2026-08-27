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
    clase: "lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-square",
  },
  {
    src: "/galeria/detalle.jpeg",
    alt: "Detalle editorial de bisutería dorada con piedras, sobre superficie natural",
    leyenda: "Cada detalle, cuidado al máximo",
    clase: "aspect-[4/3] lg:aspect-auto",
  },
  {
    src: "/galeria/empaque.jpeg",
    alt: `Collar y aretes de ${siteConfig.nombre} presentados en caja de regalo`,
    leyenda: "Así te llega: lista para regalar",
    clase: "aspect-[4/3] lg:aspect-auto",
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

      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
        {FOTOS.map(({ src, alt, leyenda, clase }) => (
          <figure
            key={src}
            className={`group relative overflow-hidden rounded-2xl shadow-lg shadow-amber-800/10 ${clase}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm font-medium text-stone-50">
              {leyenda}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
