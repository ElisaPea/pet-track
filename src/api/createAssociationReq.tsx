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
