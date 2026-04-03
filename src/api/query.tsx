import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nxawqcahssgckzwqqskk.supabase.co";
const supabaseAnonKey = "sb_publishable_4PGaX7rokNzSpzDSLmIDdg_D_9_sQr8";

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

// Function to create a new client
export async function createVetClient(clientData: { Nombre: string; DNI: string; Email: string; Teléfono: string; associated: string }) {
  const { data, error } = await supabase
    .from("Client") // Name of the table in the database
    .insert([clientData]);

  if (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
  return data;
}
