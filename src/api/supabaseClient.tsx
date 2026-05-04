import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nxawqcahssgckzwqqskk.supabase.co";
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = "sb_publishable_4PGaX7rokNzSpzDSLmIDdg_D_9_sQr8";
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cuando inicializas el cliente de Supabase con persistSession: true, la librería intenta ser "inteligente" para que el usuario no tenga que loguearse cada vez que refresca la página.

// El Guardián (Lock API): Supabase usa una herramienta del navegador llamada Web Locks. Sirve para que, si tienes 3 pestañas abiertas de tu app, solo una se encargue de refrescar el token de acceso. Así evita que las 3 pestañas bombardeen al servidor al mismo tiempo.

// El conflicto en desarrollo: En React (especialmente con Vite), cuando guardas un archivo o usas el StrictMode, el código se ejecuta muy rápido o por duplicado. Esto hace que una instancia de Supabase intente "robarle" el candado a la otra antes de que termine.

// La solución: Al configurar bien el storageKey o desactivar el lock, le dices: "No te preocupes por sincronizar pestañas ahora mismo, solo deja que la petición salga".
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "pet-track-auth-key",
  },
});
