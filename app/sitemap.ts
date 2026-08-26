import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Antes el sitemap solo incluía la portada: los buscadores no podían
 * descubrir ninguna ficha de producto ni el Libro de Reclamaciones.
 * Ahora se agregan dinámicamente todas las páginas públicas reales
 * (no se listan /cuenta ni /favoritos: son páginas personalizadas por
 * visitante, ya marcadas `noindex`, sin valor de indexación).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rutasEstaticas: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/libro-de-reclamaciones`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/nuestra-historia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("productos")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) return rutasEstaticas;

    const rutasProductos: MetadataRoute.Sitemap = data.map((producto) => ({
      url: `${siteConfig.url}/producto/${producto.id}`,
      lastModified: new Date(producto.created_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...rutasEstaticas, ...rutasProductos];
  } catch {
    // Si Supabase no responde, el sitemap igual se sirve con las rutas
    // estáticas en vez de romper por completo.
    return rutasEstaticas;
  }
}
