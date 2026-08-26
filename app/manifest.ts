import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/**
 * Hace la web instalable como app en el celular ("Agregar a
 * pantalla de inicio"). A propósito no incluye un service worker:
 * en una tienda con stock y precios que cambian, cachear datos
 * agresivamente podría mostrarle a una clienta un precio o
 * disponibilidad vencidos — el riesgo no vale la pena frente al
 * beneficio de navegar sin conexión.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.nombre} — ${siteConfig.eslogan}`,
    short_name: siteConfig.nombre,
    description: siteConfig.descripcion,
    start_url: "/",
    display: "standalone",
    background_color: "#fdfaf3",
    theme_color: "#a9793b",
    lang: "es-PE",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
