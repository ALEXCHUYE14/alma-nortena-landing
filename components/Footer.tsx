import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { Filigrana } from "@/components/Filigrana";
import { enlacesNavegacion, siteConfig, urlWhatsApp } from "@/lib/config";

const metodosPago = ["Yape", "Plin", "Transferencia BCP", "Transferencia Interbank"];

const politicas = [
  { href: "#", etiqueta: "Política de privacidad" },
  { href: "#", etiqueta: "Cambios y devoluciones" },
  { href: "#", etiqueta: "Términos y condiciones" },
  { href: "#", etiqueta: "Libro de reclamaciones" },
];

export function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer id="contacto" className="textura-toquilla-oscura text-stone-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Filigrana className="mb-10 opacity-80" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl text-stone-50">
              Alma <span className="italic text-yellow-600">Norteña</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Moda y joyería con identidad piurana, desde el corazón artesanal
              de Catacaos para todo el norte del Perú.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
              Visítanos
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-yellow-600" aria-hidden="true" />
                {siteConfig.contacto.direccion}
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="mt-0.5 shrink-0 text-yellow-600" aria-hidden="true" />
                {siteConfig.contacto.horario}
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-yellow-600" aria-hidden="true" />
                <a href={`mailto:${siteConfig.contacto.email}`} className="hover:text-stone-50">
                  {siteConfig.contacto.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-yellow-600" aria-hidden="true" />
                <a
                  href={urlWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-50"
                >
                  WhatsApp: atención directa
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
              Explora
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {enlacesNavegacion.map((e) => (
                <li key={e.href}>
                  <a href={e.href} className="transition-colors hover:text-stone-50">
                    {e.etiqueta}
                  </a>
                </li>
              ))}
              {politicas.map((p) => (
                <li key={p.etiqueta}>
                  <a href={p.href} className="transition-colors hover:text-stone-50">
                    {p.etiqueta}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagos */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
              Métodos de pago
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {metodosPago.map((metodo) => (
                <li
                  key={metodo}
                  className="rounded-full border border-stone-700 bg-stone-800/60 px-3 py-1.5 text-xs font-medium text-stone-200"
                >
                  {metodo}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-stone-500">
              Pagos 100% seguros coordinados con tu asesora. Emitimos boleta o
              factura electrónica.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-stone-800 pt-6 text-center text-xs text-stone-500 sm:flex-row sm:justify-between">
          <p>
            © {anio} {siteConfig.nombre} · Catacaos, Piura, Perú
          </p>
          <p>Hecho con orgullo norteño 🌵</p>
        </div>
      </div>
    </footer>
  );
}
