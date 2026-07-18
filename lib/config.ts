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
    numero: "51968745123", // Formato internacional sin "+"
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
