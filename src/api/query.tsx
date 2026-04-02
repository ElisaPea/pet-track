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

// Función para crear una mascota y vincularla a un usuario
export async function createPet(
  petData: { name: string; breed?: string; birthDate?: string },
  userId: string,
) {
  if (!userId) throw new Error("No se ha detectado un usuario válido.");

  // 1. Insertamos la mascota en la tabla "Pet"
  const { data: pet, error: petError } = await supabase
    .from("Pet")
    .insert([
      {
        name: petData.name,
        breed: petData.breed,
        birthdate: petData.birthDate,
        isverified: false,
      },
    ])
    .select()
    .single();

  if (petError) {
    // Si Supabase devuelve error (ej: el nombre es demasiado largo o falta un campo obligatorio)
    console.error("Error al crear mascota:", petError);
    throw new Error("Error en la base de datos al crear la mascota.");
  }

  // 2. Creamos la relación en "PetUser"
  const { error: relationError } = await supabase.from("PetUser").insert([
    {
      petid: pet.id,
      userid: userId,
    },
  ]);

  if (relationError) {
    console.error("Error al vincular mascota con usuario:", relationError);
    throw new Error("La mascota se creó pero no pudo vincularse a tu cuenta.");
  }

  return pet;
}
