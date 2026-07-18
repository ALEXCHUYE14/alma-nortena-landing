import type { ItemCarrito, Producto } from "@/lib/types";

/**
 * Configuración central del sitio.
 * Cambia estos valores una sola vez y se propagan a toda la aplicación.
 */
export const siteConfig = {
  nombre: "GRC Bisutería",
  eslogan: "Elegancia con esencia piurana",
  descripcion:
    "Bisutería moderna y accesible: aretes, collares, pulseras y sets combinados pensados para la mujer real. Pedidos por WhatsApp con envío en Piura.",
  // TODO: reemplazar por el dominio real cuando lo compren (ej. grcbisuteria.pe)
  url: "https://almanortena.vercel.app",
  whatsapp: {
    numero: "51923872357", // Formato internacional sin "+"
    mensaje:
      "Hola 👋 Vi la tienda GRC Bisutería y me gustaría ver el catálogo.",
  },
  contacto: {
    // TODO: confirmar dirección real (se quitó la de Alma Norteña por ser de otro negocio)
    direccion: "Piura, Perú",
    email: "hola@grcbisuteria.pe",
    horario: "Lun – Sáb · 9:00 a.m. – 8:00 p.m.",
  },
  redes: {
    instagram: "https://instagram.com/grcbisuteria",
    facebook: "https://facebook.com/grcbisuteria",
    tiktok: "https://tiktok.com/@grcbisuteria",
  },
} as const;

export const enlacesNavegacion = [
  { href: "#coleccion", etiqueta: "Colección" },
  { href: "#nosotras", etiqueta: "Nuestra historia" },
  { href: "#preguntas", etiqueta: "Preguntas frecuentes" },
  { href: "#suscripcion", etiqueta: "Club GRC" },
  { href: "#contacto", etiqueta: "Contacto" },
] as const;

export function urlWhatsApp(): string {
  const { numero, mensaje } = siteConfig.whatsapp;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(precio);
}

/**
 * Calcula el % de descuento solo si `precio_original` es real y mayor
 * al precio actual. Evita mostrar rebajas falsas cuando el campo está
 * vacío o mal configurado.
 */
export function porcentajeDescuento(producto: Producto): number | null {
  if (!producto.precio_original || producto.precio_original <= producto.precio) {
    return null;
  }
  const descuento =
    ((producto.precio_original - producto.precio) / producto.precio_original) * 100;
  return Math.round(descuento);
}

/**
 * Arma el mensaje de WhatsApp con el detalle del pedido (items, cantidades
 * y total) para que la asesora reciba todo el contexto sin preguntar de nuevo.
 */
export function urlWhatsAppPedido(
  items: ItemCarrito[],
  total: number,
  metodoPago: "Yape" | "Coordinar pago"
): string {
  const detalle = items
    .map(
      ({ producto, cantidad }) =>
        `• ${cantidad}x ${producto.nombre} — ${formatearPrecio(producto.precio * cantidad)}`
    )
    .join("\n");

  const mensaje =
    `Hola 👋 Quiero confirmar mi pedido en GRC Bisutería:\n\n${detalle}\n\n` +
    `Total: ${formatearPrecio(total)}\n` +
    `Método de pago: ${metodoPago}\n\n` +
    `Quedo atenta a la confirmación. ¡Gracias!`;

  return `https://wa.me/${siteConfig.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}
