import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * proxy.ts — Reemplaza al deprecated middleware.ts en Next.js 16.
 * El runtime ahora es Node.js (no Edge), así que podemos hacer
 * queries directas a Supabase sin restricciones del Edge runtime.
 *
 * Estrategia:
 * 1. Leer la sesión del JWT en las cookies (firmado por Supabase, no manipulable).
 * 2. Verificar el usuario con getUser() — valida el token en el servidor.
 * 3. Consultar el rol en user_roles directamente desde la DB.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Necesitamos poder propagar cookies actualizadas (ej. token refresh)
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verificar sesión válida (el JWT está firmado por Supabase)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Sin sesión → redirigir al login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Consultar el rol real en la DB (no en cookies manipulables)
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleData || roleData.role !== "admin") {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
