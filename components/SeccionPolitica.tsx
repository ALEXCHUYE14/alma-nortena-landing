import type { ReactNode } from "react";

/**
 * Bloque reutilizable para las páginas legales (Términos, Privacidad,
 * Cambios y devoluciones): mantiene la misma tipografía y espaciado en
 * las tres para que no se vean como páginas sueltas.
 */
export function SeccionPolitica({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-amber-800/10 py-8 first:pt-0 last:border-b-0">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-stone-900 sm:text-2xl">
        <span className="mr-2 text-amber-800">{numero}.</span>
        {titulo}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-stone-600">
        {children}
      </div>
    </section>
  );
}
