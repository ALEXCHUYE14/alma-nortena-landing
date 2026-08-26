"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductGrid";
import { QuickViewModal } from "@/components/QuickViewModal";
import type { Producto } from "@/lib/types";

/**
 * Reutiliza la misma <ProductCard /> del grid principal (favoritos,
 * vista rápida, añadir al carrito) para listas cortas de productos,
 * como "También te puede gustar", sin los controles de orden/filtro.
 */
export function RelatedProductsGrid({ productos }: { productos: Producto[] }) {
  const [productoVistaRapida, setProductoVistaRapida] = useState<Producto | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {productos.map((producto, i) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            indice={i}
            onVistaRapida={setProductoVistaRapida}
          />
        ))}
      </div>

      <AnimatePresence>
        {productoVistaRapida && (
          <QuickViewModal
            producto={productoVistaRapida}
            onCerrar={() => setProductoVistaRapida(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
