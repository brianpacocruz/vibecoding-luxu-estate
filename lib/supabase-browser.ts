import { createBrowserClient } from "@supabase/ssr";

/**
 * Singleton del cliente Supabase para el navegador.
 * Usa @supabase/ssr que guarda la sesión en COOKIES (no localStorage),
 * de modo que el middleware del servidor puede leerla y verificarla.
 *
 * IMPORTANTE: Este debe ser el ÚNICO cliente Supabase activo en el browser.
 * Tener dos clientes activos (uno en cookies, otro en localStorage) causa
 * conflictos de sesión y el usuario no puede cambiar de cuenta.
 */
let _instance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!_instance) {
    _instance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _instance;
}
