import { createClient } from "@supabase/supabase-js";

// Esto es para conectar con la base de datos
// Habrá que quitarlo cuando usemos .env por seguridad
const supabaseUrl = "https://nxawqcahssgckzwqqskk.supabase.co";
const supabaseAnonKey = "sb_publishable_4PGaX7rokNzSpzDSLmIDdg_D_9_sQr8";
const veterinarycenterid = "c41de394-45ad-47b2-9d4d-5d2c0b137cec";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



/**
 * Obtiene la lista de centros veterinarios de la base de datos.
 * @returns Una promesa que resuelve a un array de centros veterinarios.
 */
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
//-------------------------------------------aroa---AccountSettingsVet------------------------------------------
// 1. Get Vet Data (Read)
export async function getVetProfile(userId: string) {
  const { data, error } = await supabase
    .from("User")
    .select(`
      name,
      phone,
      Professional (
        licensenumber
      )
    `)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const result = data as any;

  return {
    name: result?.name || "",
    phone: result?.phone || "",
    // We access the first element of the Professional array
    licenseNumber: result?.Professional?.[0]?.licensenumber || ""
  };
}
//--------------aroa--------------GET Account User-----------------
// 1. Get User Data (Read)
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("User")
    .select(`
      name,
      phone
    `)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const result = data as any;

  return {
    name: result?.name || "",
    phone: result?.phone || ""
  };
}

// 2. Update Vet Data (Write)
export async function updateVetProfile(
  userId: string,
  updateData: { name: string; phone: string; licenseNumber: string }
) {
  // --- IMPORTANTE: También debemos actualizar la tabla User ---
  const { error: errorUser } = await supabase
    .from("User")
    .update({ name: updateData.name, phone: updateData.phone })
    .eq("id", userId);

  if (errorUser) throw errorUser;

  // Update Professional table (license number)
  const { error: errorPro } = await supabase
    .from("Professional")
    .update({ licensenumber: updateData.licenseNumber })
    .eq("userid", userId);

  if (errorPro) throw errorPro;
}
/*
export async function updateVetProfile(
  userId: string,
  updateData: { name: string; phone: string; licenseNumber: string }
) {
  // Update Professional table (license number)
  const { error: errorPro } = await supabase
    .from("Professional")
    .update({ licensenumber: updateData.licenseNumber })
    .eq("userid", userId);

  if (errorPro) throw errorPro;
};
*/

// 2. Update User Data (Write)
export async function updateUserProfile(
  userId: string,
  updateData: { name: string; phone: string }
) {
  // Update User table (name and phone)
  const { error: errorUser } = await supabase
    .from("User")
    .update({ name: updateData.name, phone: updateData.phone })
    .eq("id", userId);

  if (errorUser) throw errorUser;
}

//-------------------------------------------Malcon------------------------------------------
/**
 * Obtiene los perfiles de los clientes de un centro veterinario.
 * Estos clientes no son necesariamente usuarios de la aplicación.
 * @param vetCenterId - ID del centro veterinario (por defecto usa el global mockeado).
 * @returns Array de clientes del centro veterinario.
 */
export async function getClientProfiles(vetCenterId: string = veterinarycenterid) {
  const { data, error } = await supabase
    .from("Client")
    .select("*")
    .eq("veterinarycenterid", vetCenterId);

  if (error) {
    console.error("Error al obtener los clientes del centro veterinario:", error);
    throw error;
  }

  return data;
}
//-------------------------------------------Malcon------------------------------------------

//-------------------------------------------Malcon------------------------------------------

/**
 * Obtiene las mascotas asociadas a un cliente específico.
 * Utiliza una consulta a PetClient con un JOIN hacia la tabla Pet.
 * @param clientId - ID del cliente
 * @returns Array de mascotas
 */
export async function getPetsByClient(clientId: string) {
  const { data, error } = await supabase
    .from("PetClient")
    .select(`
      Pet (
        id,
        name,
        species,
        breed,
        birthdate,
        isverified
      )
    `)
    .eq("clientid", clientId);
  if (error) {
    console.error("Error al obtener las mascotas del cliente:", error);
    throw error;
  }
  // Supabase devuelve el objeto Pet anidado [{ Pet: { id: ... } }]. 
  // Lo mapeamos para devolver un array más limpio de las mascotas y filtramos nulos si los hay.
  return data.map(item => item.Pet).filter(Boolean);
}
//-------------------------------------------Malcon------------------------------------------

//-------------------------------------------Malcon------------------------------------------
/**
 * Actualiza los datos de un cliente específico en la tabla Client.
 * @param clientId - ID del cliente que se quiere actualizar.
 * @param updateData - Objeto con los datos a actualizar (name, email, phone, userid)
 */
export async function updateClientProfile(
  clientId: string,
  updateData: { name?: string; email?: string; phone?: string; userid?: string | null }
) {
  const { error } = await supabase
    .from("Client")
    .update(updateData)
    .eq("id", clientId);

  if (error) {
    console.error("Error al actualizar los datos del cliente:", error);
    throw error;
  }
}

//-------------------------------------------Malcon------------------------------------------
