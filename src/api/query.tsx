import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nxawqcahssgckzwqqskk.supabase.co";
const supabaseAnonKey = "sb_publishable_4PGaX7rokNzSpzDSLmIDdg_D_9_sQr8";
const veterinarycenterid = "c41de394-45ad-47b2-9d4d-5d2c0b137cec";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getUser() {
  // LOGICA DE SUPABASE
}

// Función para obtener la lista de centros veterinarios
export async function getVetCenters() {
  const { data, error } = await supabase
    .from("VeterinaryCenter") // Nombre base de datos
    .select("*");

  if (error) {
    console.error("Error al obtener centros:", error);
    return [];
  }
  return data;
}

/**
 * Function to create a new client in the database
 *
 * @param clientData - An object with the information coming from the form.
 * - name, email, phone are the ones we ask for when adding the client manually.
 * - userid: We allow null if it is not a registered user in the app.
 */
export async function createVetClient(
  clientData: { name: string; email: string; phone: string; userid?: string | null }
) {
  // We perform the insertion using the Supabase API
  const { data: vetClient, error: vetClientError } = await supabase
    .from("Client") // This must be the exact name of your table in Supabase
    .insert([
      {
        // We map the data from the parameter to the table columns.
        // We omit id, createdat, updatedat, etc., because Supabase generates them automatically (default values).
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        userid: clientData.userid || null, // Null is explicitly assigned in the case of the 'No' option

        // Mockeado temporalmente para permitir crear registros (obligatorio por base de datos)
        veterinarycenterid: veterinarycenterid,
      }
    ])
    // .select() asks Supabase to return the newly created record
    .select()
    // .single() indicates that we expect 1 single return, not a whole list
    .single();

  // Error handling: if for any reason it fails, Supabase will send us a vetClientError
  if (vetClientError) {
    console.error("Error detallado al crear cliente en Supabase:", vetClientError);
    throw new Error("No se pudo insertar el cliente en la base de datos.");
  }

  // If everything goes well, we return the newly created information
  return vetClient;
}
