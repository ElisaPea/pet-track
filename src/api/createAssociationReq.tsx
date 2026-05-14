import { supabase } from "./supabaseClient";

/**
 * Crea una nueva solicitud de asociación
 */
export async function createAssociationRequest(
  issuerId: string,
  targetEmail: string,
  role: "user" | "professional",
) {
  const { data, error } = await supabase
    .from("AssociationRequest")
    .insert([
      {
        issuer_id: issuerId,
        target_email: targetEmail.toLowerCase().trim(),
        role_issuer: role,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error al crear la solicitud:", error);
    throw new Error("No se pudo enviar la solicitud de asociación.");
  }

  return data;
}

/**
 * Comprueba si existe alguna solicitud entre un usuario y un email
 */
export async function getAssociationStatus(
  senderId: string,
  targetEmail: string,
) {
  const { data, error } = await supabase
    .from("AssociationRequest")
    .select("*")
    .or(`senderId.eq.${senderId},targetEmail.eq.${targetEmail}`)
    // Buscamos que coincida el emisor O el email de destino
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // Ignorar error de "no encontrado"
    console.error("Error al obtener estado asociación:", error);
    return null;
  }

  return data; // Devolverá el registro si existe, o null si no
}
