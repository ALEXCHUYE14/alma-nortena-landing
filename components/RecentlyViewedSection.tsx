"use client";

import { useEffect } from "react";
import { RelatedProductsGrid } from "@/components/RelatedProductsGrid";
import { useVistosRecientemente } from "@/components/RecentlyViewedProvider";
import type { Producto } from "@/lib/types";

/**
 * Componente invisible: registra la pieza actual como "vista" apenas
 * se monta la ficha de producto. Vive aparte de <RecentlyViewedSection />
 * para poder registrarse arriba de la página sin depender del orden
 * de renderizado de la sección que la muestra.
 */
export function RegistrarVisto({ producto }: { producto: Producto }) {
  const { registrarVisto } = useVistosRecientemente();

  useEffect(() => {
    registrarVisto(producto);
    // Solo al montar la ficha: no queremos re-registrar en cada
    // render, solo cuando el visitante realmente abre el producto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto.id]);

  return null;
}

export function RecentlyViewedSection({ excluirId }: { excluirId?: string }) {
  const { vistos } = useVistosRecientemente();
  const lista = excluirId ? vistos.filter((p) => p.id !== excluirId) : vistos;

  if (lista.length === 0) return null;

  return (
    <section className="mt-14 border-t border-amber-800/10 pt-10">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">
        Vistos recientemente
      </h2>
      <div className="mt-6">
        <RelatedProductsGrid productos={lista} />
      </div>
    </section>
  );
}
