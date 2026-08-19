import { PackageCheck, Search } from "lucide-react";
import { IconoWhatsApp } from "@/components/IconoWhatsApp";

const PASOS = [
  {
    numero: "1",
    Icono: Search,
    titulo: "Elige tu pieza favorita",
    detalle: "Explora la colección y guarda en favoritos lo que te enamore.",
  },
  {
    numero: "2",
    Icono: IconoWhatsApp,
    titulo: "Escríbenos por WhatsApp",
    detalle: "Confirma tu pedido y coordina el pago con tu asesora.",
  },
  {
    numero: "3",
    Icono: PackageCheck,
    titulo: "Recibe en la puerta de tu casa",
    detalle: "Envío el mismo día en Piura Metropolitana.",
  },
] as const;

export function ComoComprar() {
  return (
    <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
      {PASOS.map(({ numero, Icono, titulo, detalle }) => (
        <div key={numero} className="relative text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-800 text-stone-50">
            <Icono size={24} aria-hidden="true" />
          </div>
          <span className="mt-3 block font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-widest text-yellow-600">
            Paso {numero}
          </span>
          <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg font-bold text-stone-900">
            {titulo}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">{detalle}</p>
        </div>
      ))}
    </div>
  );
}
