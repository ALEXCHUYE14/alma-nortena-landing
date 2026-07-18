import type { ItemCarrito } from "@/lib/types";

/**
 * Configuración central del sitio.
 * Cambia estos valores una sola vez y se propagan a toda la aplicación.
 */
export const siteConfig = {
  nombre: "Alma Norteña",
  eslogan: "Moda y joyería fina en Piura y Catacaos",
  descripcion:
    "Boutique de moda femenina y joyería en filigrana de plata inspirada en la tradición artesanal de Catacaos. Envíos el mismo día en Piura Metropolitana.",
  url: "https://almanortena.pe",
  whatsapp: {
    numero: "51923872357", // Formato internacional sin "+"
    mensaje:
      "Hola 👋 Vi la tienda Alma Norteña y me gustaría hablar con una asesora.",
  },
  contacto: {
    direccion: "Calle Comercio 512, Catacaos, Piura",
    email: "hola@almanortena.pe",
    horario: "Lun – Sáb · 9:00 a.m. – 8:00 p.m.",
  },
  redes: {
    instagram: "https://instagram.com/almanortena.pe",
    facebook: "https://facebook.com/almanortena.pe",
    tiktok: "https://tiktok.com/@almanortena.pe",
  },
} as const;

export const enlacesNavegacion = [
  { href: "#coleccion", etiqueta: "Colección" },
  { href: "#nosotras", etiqueta: "Nuestra historia" },
  { href: "#preguntas", etiqueta: "Preguntas frecuentes" },
  { href: "#suscripcion", etiqueta: "Club Alma" },
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
    `Hola 👋 Quiero confirmar mi pedido en Alma Norteña:\n\n${detalle}\n\n` +
    `Total: ${formatearPrecio(total)}\n` +
    `Método de pago: ${metodoPago}\n\n` +
    `Quedo atenta a la confirmación. ¡Gracias!`;

  return `https://wa.me/${siteConfig.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}
