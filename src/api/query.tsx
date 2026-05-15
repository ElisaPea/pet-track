import { supabase } from "./supabaseClient";

// const veterinarycenterid = "c41de394-45ad-47b2-9d4d-5d2c0b137cec";

// Función para obtener la lista de centros veterinarios
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
export async function createVetClient(clientData: {
  name: string;
  email: string;
  phone: string;
  veterinarycenterid: string;
  userid?: string | null;
}) {
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
        veterinarycenterid: clientData.veterinarycenterid,
      },
    ])
    // .select() asks Supabase to return the newly created record
    .select()
    // .single() indicates that we expect 1 single return, not a whole list
    .single();

  // Error handling: if for any reason it fails, Supabase will send us a vetClientError
  if (vetClientError) {
    console.error(
      "Error detallado al crear cliente en Supabase:",
      vetClientError,
    );
    throw new Error("No se pudo insertar el cliente en la base de datos.");
  }

  // If everything goes well, we return the newly created information
  return vetClient;
}

// Función para crear una mascota y vincularla a un usuario
export async function createPet(
  petData: { name: string; breed?: string; birthDate?: string; weight?: number; vaccines?: boolean },
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
        weight: petData.weight,
        vaccines: petData.vaccines,
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

// Función para crear una mascota y vincularla a un cliente (veterinaria)
export async function createPetForClient(
  petData: {
    name: string;
    species?: string;
    breed?: string;
    birthdate?: string;
  },
  clientId: string,
) {
  if (!clientId) throw new Error("No se ha detectado un cliente válido.");

  // 1. Insertamos la mascota en la tabla "Pet"
  const { data: pet, error: petError } = await supabase
    .from("Pet")
    .insert([
      {
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        birthdate: petData.birthdate,
        isverified: false,
      },
    ])
    .select()
    .single();

  if (petError) {
    console.error("Error al crear mascota:", petError);
    throw new Error("Error en la base de datos al crear la mascota.");
  }

  // 2. Creamos la relación en "PetClient"
  const { error: relationError } = await supabase.from("PetClient").insert([
    {
      petid: pet.id,
      clientid: clientId,
    },
  ]);

  if (relationError) {
    console.error("Error al vincular mascota con cliente:", relationError);
    throw new Error("La mascota se creó pero no pudo vincularse al cliente.");
  }

  return pet;
}
//-------------------------------------------aroa---AccountSettingsVet------------------------------------------
// 1. Get Vet Data (Read)
export async function getVetProfile(userId: string) {
  const { data, error } = await supabase
    .from("User")
    .select(
      `
      name,
      phone,
      Professional (
        licensenumber
      )
    `,
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const result = data as any;

  return {
    name: result?.name || "",
    phone: result?.phone || "",
    // We access the first element of the Professional array
    licenseNumber: result?.Professional?.[0]?.licensenumber || "",
  };
}
//--------------aroa--------------GET Account User-----------------
// 1. Get User Data (Read)
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("User")
    .select(
      `
      name,
      phone
    `,
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const result = data as any;

  return {
    name: result?.name || "",
    phone: result?.phone || "",
  };
}

// --- Mia ---
// 2. Update Vet Data (Write) - Recibe el perfil completo
// export async function updateVetProfile(userData: UserProfile) {
//   const {
//     id,
//     name,
//     phone,
//     licenseNumber,
//     veterinaryCenterId,
//     isactive,
//     lgpdconsent,
//   } = userData;

//   // 1. Actualizamos la tabla "User"
//   // Solo metemos los campos que pertenecen a esta tabla
//   const { error: errorUser } = await supabase
//     .from("User")
//     .update({
//       name,
//       phone,
//       isactive,
//       lgpdconsent,
//     })
//     .eq("id", id);

//   if (errorUser) {
//     console.error("Error al actualizar tabla User:", errorUser);
//     throw errorUser;
//   }

//   // 2. Si el rol es profesional, actualizamos la tabla "Professional"
//   if (userData.role === "professional") {
//     const { error: errorPro } = await supabase
//       .from("Professional")
//       .update({
//         licensenumber: licenseNumber,
//         veterinarycenterid: veterinaryCenterId,
//       })
//       .eq("userid", id);

//     if (errorPro) {
//       console.error("Error al actualizar tabla Professional:", errorPro);
//       throw errorPro;
//     }
//   }

//   return true;
// }

//MALCON
export async function updateVetProfile(
  userId: string,
  updateData: { name: string; phone: string; licenseNumber: string },
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

// 2. Update User Data (Write)
export async function updateUserProfile(
  userId: string,
  updateData: { name: string; phone: string },
) {
  // Update User table (name and phone)
  const { error: errorUser } = await supabase
    .from("User")
    .update({ name: updateData.name, phone: updateData.phone })
    .eq("id", userId);

  if (errorUser) throw errorUser;
}
// --------------------------- WELCOME USER PAGE  ---------------------
// SELECT PET BY USER
export async function getPetsByUser(userId: string) {
  const { data, error } = await supabase
    .from("PetUser")
    .select(
      `
      Pet (
        id,
        name,
        breed,
        birthdate 
      )
    `,
    )
    .eq("userid", userId);

  if (error) {
    console.error("Error al obtener mascotas:", error);
    throw new Error(error.message);
  }

  // Aplanamos el resultado para tener un array de mascotas directamente
  return data?.map((row: any) => row.Pet).filter(Boolean) ?? [];
}
// SELECT PET BY ID
export async function getPetById(petId: string) {
  const { data, error } = await supabase
    .from("Pet")
    .select("id, name, breed, birthdate, weight, vaccines")
    .eq("id", petId)
    .single();

  if (error) {
    console.error("Error al obtener mascota:", error);
    throw error;
  }

  return data;
}
// UPDATE PET
export async function updatePet(
  petId: string,
  petData: { name: string; breed?: string; birthDate?: string; weight?: number; vaccines?: boolean },
) {
  const { data, error } = await supabase
    .from("Pet")
    .update({
      name: petData.name,
      breed: petData.breed,
      birthdate: petData.birthDate,
      weight: petData.weight,
      vaccines: petData.vaccines,
    })
    .eq("id", petId)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar mascota:", error);
    throw new Error("No se pudo actualizar la mascota.");
  }

  return data;
}
// SELECT NOTAS
export async function getPetUserNotas(petId: string, userId: string) {
  const { data, error } = await supabase
    .from("PetUser")
    .select("extrafields")
    .eq("petid", petId)
    .eq("userid", userId)
    .maybeSingle();

  if (error) {
    console.error("Error al obtener notas:", error);
    throw error;
  }

  return {
    notasUser: data?.extrafields ?? "",
  };
}
// UPDATE NOTAS
export async function updatePetUserNotas(
  petId: string,
  userId: string,
  notasUser: string,
) {
  const { error } = await supabase
    .from("PetUser")
    .update({ extrafields: notasUser })
    .eq("petid", petId)
    .eq("userid", userId);

  if (error) {
    console.error("Error al actualizar notas:", error);
    throw error;
  }
}

// USER

export async function getCurrentUserId() {
  return "2427a02c-b1c9-423e-9aab-4ed448c34b5b";
}

export async function getCurrentUserName() {
  const userId = await getCurrentUserId();
  const user = await getUserProfile(userId);
  return user.name;
}

//-------------------------------------------Malcon------------------------------------------
/**
 * Obtiene los perfiles de los clientes de un centro veterinario.
 * Estos clientes no son necesariamente usuarios de la aplicación.
 * @param vetCenterId - ID del centro veterinario (por defecto usa el global mockeado).
 * @returns Array de clientes del centro veterinario.
 */
export async function getClientProfiles(vetCenterId: string) {
  const { data, error } = await supabase
    .from("Client")
    .select("*")
    .eq("veterinarycenterid", vetCenterId);

  if (error) {
    console.error(
      "Error al obtener los clientes del centro veterinario:",
      error,
    );
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
    .select(
      `
      Pet (
        id,
        name,
        species,
        breed,
        birthdate,
        isverified
      )
    `,
    )
    .eq("clientid", clientId);
  if (error) {
    console.error("Error al obtener las mascotas del cliente:", error);
    throw error;
  }
  // Supabase devuelve el objeto Pet anidado [{ Pet: { id: ... } }].
  // Lo mapeamos para devolver un array más limpio de las mascotas y filtramos nulos si los hay.
  return data.map((item) => item.Pet).filter(Boolean);
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
  updateData: {
    name?: string;
    email?: string;
    phone?: string;
    userid?: string | null;
  },
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

/**
 * Crea un nuevo centro veterinario
 */
export async function createVetCenter(centerData: {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from("VeterinaryCenter")
    .insert([
      {
        name: centerData.name,
        email: centerData.email,
        address: centerData.address || null,
        phone: centerData.phone || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
