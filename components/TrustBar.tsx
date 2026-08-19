import { Gem, ShieldCheck, Truck, Users } from "lucide-react";

const ITEMS = [
  {
    Icono: Truck,
    titulo: "Envío el mismo día",
    detalle: "Gratis en Piura, Castilla y Catacaos",
  },
  {
    Icono: ShieldCheck,
    titulo: "Pago 100% seguro",
    detalle: "Yape, Plin o transferencia",
  },
  {
    Icono: Gem,
    titulo: "Piezas verificadas",
    detalle: "Cada producto, revisado a mano",
  },
  {
    Icono: Users,
    titulo: "Atención personalizada",
    detalle: "Una asesora real, por WhatsApp",
  },
] as const;

export function TrustBar() {
  return (
    <section className="border-b border-amber-800/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
        {ITEMS.map(({ Icono, titulo, detalle }) => (
          <div key={titulo} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-800/10 text-amber-800">
              <Icono size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-stone-900">{titulo}</p>
              <p className="text-xs text-stone-500">{detalle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
