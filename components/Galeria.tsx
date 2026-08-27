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
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
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

      <div className="mx-auto grid max-w-2xl gap-4 grid-cols-2 sm:grid-cols-3">
        {FOTOS.map(({ src, alt, leyenda }, indice) => (
          <figure
            key={src}
            className={`group relative aspect-square overflow-hidden rounded-xl shadow-md shadow-amber-800/10 ${
              indice === 0 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 640px) 220px, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs font-medium text-stone-50">
              {leyenda}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
