import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieAEscribir = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Cliente de Supabase para Server Components, Server Actions
 * y Route Handlers (Next.js 15: `cookies()` es asíncrono).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieAEscribir[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component: las cookies solo pueden
            // escribirse en Server Actions o Route Handlers. Se ignora de
            // forma segura porque aquí solo realizamos lecturas públicas.
          }
        },
      },
    }
  );
}
