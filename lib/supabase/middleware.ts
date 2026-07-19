import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieAEscribir = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Refresca la sesión de Supabase en cada request (patrón oficial de
 * @supabase/ssr para Next.js). Sin esto, las cookies de sesión pueden
 * expirar sin renovarse y el login "se cae" al navegar entre páginas.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieAEscribir[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // No ejecutar lógica entre createServerClient y getUser(): getUser()
  // es lo que efectivamente refresca el token si está por expirar.
  await supabase.auth.getUser();

  return supabaseResponse;
}
