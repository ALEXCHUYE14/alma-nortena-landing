import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para Client Components.
 * `createBrowserClient` devuelve un singleton: es seguro llamarlo
 * en cada render sin crear conexiones duplicadas.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
