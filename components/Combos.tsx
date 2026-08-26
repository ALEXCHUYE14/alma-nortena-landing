import Image from "next/image";
import { Layers } from "lucide-react";
import { Filigrana } from "@/components/Filigrana";
import { IconoWhatsApp } from "@/components/IconoWhatsApp";
import { createClient } from "@/lib/supabase/server";
import { formatearPrecio, urlWhatsAppCombo } from "@/lib/config";
import type { Combo, ComboConProductos, Producto } from "@/lib/types";

/**
 * "Arma tu set": combos de 2+ productos reales a precio especial.
 * El pedido se hace directo por WhatsApp (no por el carrito) porque
 * el precio del set es distinto a la suma de precios individuales.
 * Si no hay combos activos —o algún combo quedó con productos que
 * ya no existen—, la sección completa se omite.
 */
export async function Combos() {
  const supabase = await createClient();
  const { data: combosData, error } = await supabase
    .from("combos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error || !combosData || combosData.length === 0) return null;

  const { data: productosData } = await supabase.from("productos").select("*");
  const productosPorId = new Map(
    ((productosData ?? []) as Producto[]).map((p) => [p.id, p])
  );

  const combos: ComboConProductos[] = (combosData as Combo[])
    .map((combo) => ({
      ...combo,
      productos: combo.producto_ids
        .map((id) => productosPorId.get(id))
        .filter((p): p is Producto => Boolean(p)),
    }))
    .filter((combo) => combo.productos.length >= 2);

  if (combos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-10 text-center">
        <Filigrana className="mb-6" />
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-stone-900 sm:text-4xl">
          Arma tu set
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-900/70">
          Combinaciones pensadas para lucir un look completo, a un
          precio especial por comprarlas juntas.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {combos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>
    </section>
  );
}

function ComboCard({ combo }: { combo: ComboConProductos }) {
  const precioIndividual = combo.productos.reduce((acc, p) => acc + p.precio, 0);
  const ahorro = precioIndividual - combo.precio_combo;

  return (
    <div className="flex flex-col rounded-2xl border border-amber-800/15 bg-white p-5 shadow-sm">
      <div className="flex gap-2">
        {combo.productos.slice(0, 3).map((producto) => (
          <div
            key={producto.id}
            className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-stone-100"
          >
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-800/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
        <Layers size={11} aria-hidden="true" />
        Set de {combo.productos.length} piezas
      </span>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-stone-900">
        {combo.nombre}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-stone-500">{combo.descripcion}</p>

      <div className="mt-3 flex items-center gap-2">
        <p className="text-xl font-bold text-amber-800">
          {formatearPrecio(combo.precio_combo)}
        </p>
        {ahorro > 0 && (
          <p className="text-sm text-stone-400 line-through">
            {formatearPrecio(precioIndividual)}
          </p>
        )}
      </div>
      {ahorro > 0 && (
        <p className="text-xs font-semibold text-yellow-700">
          Ahorras {formatearPrecio(ahorro)}
        </p>
      )}

      <a
        href={urlWhatsAppCombo(combo)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-amber-800 py-3 text-xs font-bold uppercase tracking-wider text-stone-50 transition-colors hover:bg-amber-900"
      >
        <IconoWhatsApp size={16} />
        Pedir este set
      </a>
    </div>
  );
}
