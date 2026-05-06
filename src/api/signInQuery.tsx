import { SCREEN } from "../constants/constants";
import { supabase } from "./supabaseClient";

/**
 * Registra un nuevo usuario
 */
export async function signUpComplete(formData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "user" | "professional";
  licenseNumber?: string;
  veterinaryCenterId?: string;
}) {
  // 1. Registro en Supabase Auth: el usuario se crea y se loguea automáticamente
  console.log("1. Empezando signUp");
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  console.log("authError", authError);
  if (authError) throw authError;
  const user = authData.user;
  console.log("user", user);

  if (user) {
    console.log("2. Usuario en Auth creado, insertando en tabla User...");
    // 2. Insertamos en tabla "User" (el ID de authData.user.id para mantener la relación)
    const { error: userError } = await supabase.from("User").insert([
      {
        id: user.id,
        name: formData.name,
        phone: formData.phone?.trim() || null,
        role: formData.role,
        lgpdconsent: true,
        lgpdconsentdate: new Date().toISOString(),
        isactive: true,
      },
    ]);

    if (userError) {
      console.log("3. Error en tabla User:", userError);
      console.error("Error al crear perfil de usuario:", userError);
      throw new Error(
        "Se creó la cuenta pero no el perfil. Contacta con soporte.",
      );
    }
    console.log("4. Inserción en User exitosa");
    // 3. Si el rol es profesional, rellenamos la tabla "Professional"
    if (formData.role === "professional") {
      console.log("5. Es profesional, insertando...");
      const { error: profError } = await supabase.from("Professional").insert([
        {
          userid: user.id,
          licensenumber: formData.licenseNumber,
          veterinarycenterid: formData.veterinaryCenterId,
        },
      ]);

      if (profError) {
        console.error("Error al crear perfil profesional:", profError);
        throw new Error(
          "Perfil de usuario creado, pero hubo un error con los datos de veterinario.",
        );
      }
    }
  }

  return authData;
}

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Personalizamos el error para que sea más amigable en el frontend
    if (error.message === "Invalid login credentials") {
      throw new Error("El correo o la contraseña no son correctos.");
    }
    throw error;
  }

  return data; // Contiene la sesión y el objeto user
}

/**
 * Cierra la sesión actual y si no hay errores navega a la landing page
 */
export async function logout(navigate: any) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  navigate(SCREEN.LANDING_PAGE);
}
