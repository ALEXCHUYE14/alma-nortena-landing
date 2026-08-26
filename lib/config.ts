import type { ComboConProductos, ItemCarrito, Producto, Resena } from "@/lib/types";

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
  url: "https://grcbisuteria.vercel.app",
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
    instagram:
      "https://www.instagram.com/grcbisuteria?utm_source=qr&igsh=ZTFxdm96bjVsbGh5",
    facebook: "https://www.facebook.com/share/199ayNwNCM/",
    tiktok: "https://www.tiktok.com/@grc7118?_r=1&_t=ZS-98AkEqm8m2P",
  },
} as const;

// Rutas absolutas con "/" al inicio (no solo "#ancla"): el Navbar y el
// Footer se renderizan en todas las páginas, no solo en la portada. Un
// href="#nosotras" en /producto/[id] o /favoritos no hace nada porque
// esa ancla no existe ahí; con "/#nosotras" el navegador primero va a
// la portada y luego salta a la sección, funcione desde donde funcione.
export const enlacesNavegacion = [
  { href: "/#coleccion", etiqueta: "Colección" },
  { href: "/#nosotras", etiqueta: "Nuestra historia" },
  { href: "/#preguntas", etiqueta: "Preguntas frecuentes" },
  { href: "/#suscripcion", etiqueta: "Club GRC" },
  { href: "/#contacto", etiqueta: "Contacto" },
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
 * Si se aplicó un cupón, se detalla el subtotal, el descuento y el total
 * final por separado (más claro para la asesora que un solo número).
 */
export function urlWhatsAppPedido(
  items: ItemCarrito[],
  subtotal: number,
  metodoPago: "Yape" | "Coordinar pago",
  cupon?: { codigo: string; descuento: number }
): string {
  const detalle = items
    .map(
      ({ producto, cantidad }) =>
        `• ${cantidad}x ${producto.nombre} — ${formatearPrecio(producto.precio * cantidad)}`
    )
    .join("\n");

  const totalFinal = cupon ? Math.max(0, subtotal - cupon.descuento) : subtotal;

  const lineasTotal = cupon
    ? `Subtotal: ${formatearPrecio(subtotal)}\n` +
      `Cupón (${cupon.codigo}): -${formatearPrecio(cupon.descuento)}\n` +
      `Total: ${formatearPrecio(totalFinal)}\n`
    : `Total: ${formatearPrecio(subtotal)}\n`;

  const mensaje =
    `Hola 👋 Quiero confirmar mi pedido en GRC Bisutería:\n\n${detalle}\n\n` +
    lineasTotal +
    `Método de pago: ${metodoPago}\n\n` +
    `Quedo atenta a la confirmación. ¡Gracias!`;

  return `https://wa.me/${siteConfig.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Arma el mensaje de WhatsApp para consultar disponibilidad de los
 * productos guardados en favoritos (no es un pedido confirmado).
 */
export function urlWhatsAppFavoritos(productos: Producto[]): string {
  const detalle = productos
    .map(({ nombre, precio }) => `• ${nombre} — ${formatearPrecio(precio)}`)
    .join("\n");

  const mensaje =
    `Hola 👋 Me interesan estas piezas de GRC Bisutería:\n\n${detalle}\n\n` +
    `¿Podrían confirmarme disponibilidad? ¡Gracias!`;

  return `https://wa.me/${siteConfig.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Enlace público (sin login) a una selección de favoritos para
 * compartir con alguien más — p. ej. para pedir un regalo.
 */
export function urlListaCompartida(productoIds: string[]): string {
  const parametros = new URLSearchParams({ ids: productoIds.join(",") });
  return `${siteConfig.url}/favoritos/compartir?${parametros.toString()}`;
}

/**
 * A diferencia de urlWhatsAppFavoritos (que le escribe a la tienda para
 * consultar disponibilidad), este mensaje es para reenviar a un tercero
 * —sin número fijo— así WhatsApp deja elegir a quién enviárselo.
 */
export function urlWhatsAppCompartirLista(productos: Producto[]): string {
  const link = urlListaCompartida(productos.map((p) => p.id));
  const mensaje = `¡Hola! 💛 Mira esta selección de ${siteConfig.nombre} que me encantó:\n\n${link}`;
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Arma el mensaje de WhatsApp para pedir un set/combo al precio
 * especial (no pasa por el carrito: el precio del combo es distinto
 * a la suma de precios individuales de cada producto).
 */
export function urlWhatsAppCombo(combo: ComboConProductos): string {
  const detalle = combo.productos
    .map((p) => `• ${p.nombre} — ${formatearPrecio(p.precio)}`)
    .join("\n");

  const mensaje =
    `Hola 👋 Quiero pedir el "${combo.nombre}" de GRC Bisutería:\n\n${detalle}\n\n` +
    `Precio del set: ${formatearPrecio(combo.precio_combo)}\n\n` +
    `¿Podrían confirmarme disponibilidad? ¡Gracias!`;

  return `https://wa.me/${siteConfig.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Promedio de calificación (1-5) redondeado a un decimal, o null si
 * el producto todavía no tiene reseñas aprobadas.
 */
export function promedioCalificacion(resenas: Resena[]): number | null {
  if (resenas.length === 0) return null;
  const suma = resenas.reduce((acc, r) => acc + r.calificacion, 0);
  return Math.round((suma / resenas.length) * 10) / 10;
}
