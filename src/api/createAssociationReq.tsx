import { supabase } from "./supabaseClient";

// ## Table `AssociationRequest`

// ### Columns

// | Name | Type | Constraints |
// |------|------|-------------|
// | `id` | `uuid` | Primary |
// | `senderid` | `uuid` |  |
// | `vetcenteremail` | `varchar` |  |
// | `useremail` | `varchar` |  |
// | `senderrole` | `user_role` |  |
// | `status` | `request_status` |  Nullable |
// | `createdat` | `timestamp` |  Nullable |
// | `updatedat` | `timestamp` |  Nullable |

/**
 * Crea una nueva solicitud de asociación entre un usuario y un centro.
 * @param senderId - ID del emisor (ID de la tabla User o de la tabla VeterinaryCenter)
 * @param userEmail - Email del usuario particular
 * @param vetEmail - Email del centro veterinario SE GUARDA ESTA NO LA DEL PROFESIONAL,
 * PUEDEN HABER MUCHOS PROFESIONALES EN UN CENTRO, y un client se asocia a un centro vet no a un profesional.
 * @param role - Rol de quien envía ('user' o 'professional')
 */
export async function createAssociationRequest(
  senderid: string,
  useremail: string,
  vetcenteremail: string,
  senderrole: "user" | "professional",
  clientId?: string,
) {
  const { data, error } = await supabase
    .from("AssociationRequest")
    .insert([
      {
        senderid,
        useremail: useremail.trim(),
        vetcenteremail: vetcenteremail.trim(),
        senderrole,
        status: "pending",
        clientid: clientId || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error al crear AssociationRequest:", error);
    // Podrías personalizar el error si es por duplicado (si ya existe una pendiente)
    throw new Error("No se pudo enviar la solicitud de asociación.");
  }

  return data;
}

/**
 * Obtiene las solicitudes ya aceptadas para gestionar la desvinculación.
 */
export async function getAcceptedRequests(
  email: string,
  role: "user" | "professional",
) {
  const columnToSearch = role === "user" ? "useremail" : "vetcenteremail";

  const { data, error } = await supabase
    .from("AssociationRequest")
    .select("*")
    .ilike(columnToSearch, email.trim())
    .eq("status", "accepted");

  if (error) {
    console.error("Error al obtener asociaciones aceptadas:", error);
    return [];
  }

  return data;
}

/**
 Obtiene las solicitudes rechazadas.
 */
export async function getRejectedRequests(
  email: string,
  role: "user" | "professional",
) {
  const columnToSearch = role === "user" ? "useremail" : "vetcenteremail";

  const { data, error } = await supabase
    .from("AssociationRequest")
    .select("*")
    .ilike(columnToSearch, email.trim())
    .eq("status", "rejected");

  if (error) {
    console.error("Error al obtener solicitudes rechazadas:", error);
    return [];
  }

  return data;
}

/**
 * Busca si existe alguna solicitud pendiente para el usuario actual.
 * @param email - El email del usuario o DEL CENTRO VETERINARIO logueado. En caso de
 * profesional se mira el centro vet porque se guarda eso, siendo que en la conexión entre un user
 * y un client este último es client de centro vet no de profesional.
 * @param role - El rol actual ('user' o 'professional').
 */
export async function getPendingRequests(
  email: string,
  role: "user" | "professional",
) {
  const columnToSearch = role === "user" ? "useremail" : "vetcenteremail";

  const { data, error } = await supabase
    .from("AssociationRequest")
    .select("*")
    .ilike(columnToSearch, email.trim())
    .eq("status", "pending");

  if (error) {
    console.error("Error al buscar peticiones pendientes:", error);
    return [];
  }

  return data;
}

/**
 * Acepta la solicitud y sincroniza datos de forma universal.
 * @param request - El objeto completo de la solicitud (AssociationRequest)
 * @param currentUserId - El ID del usuario que está logueado y pulsando "Aceptar"
 * @param targetVetCenterId - El ID del centro vet (solo en caso de que la petición sea enviada por un profesional)
 */
export async function acceptAssociation(
  request: any,
  currentUserId: any,
  targetVetCenterId?: string,
) {
  const {
    id: requestId,
    senderid,
    useremail,
    vetcenteremail,
    senderrole,
    clientid,
  } = request;

  try {
    let targetClientId = clientid;
    let finalUserId;
    // --- ESCENARIO A: El PROFESIONAL acepta una petición enviada por un USUARIO ---

    console.log("entro accept", senderrole);
    if (senderrole === "user") {
      finalUserId = senderid; // El que envió la petición es el usuario

      // Buscamos si existe ficha para ese usuario por correo
      const { data: existingClient } = await supabase
        .from("Client")
        .select("id")
        .eq("email", useremail)
        .eq("veterinarycenterid", targetVetCenterId)
        .maybeSingle();

      if (existingClient) {
        targetClientId = existingClient.id;
        await supabase
          .from("Client")
          .update({ userid: finalUserId })
          .eq("id", targetClientId);
      } else {
        // Si no existe, creamos la ficha
        const { data: newClient } = await supabase
          .from("Client")
          .insert([
            {
              name: `Cliente ${useremail.split("@")[0]}`,
              email: useremail,
              veterinarycenterid: targetVetCenterId,
              userid: finalUserId,
            },
          ])
          .select()
          .single();
        targetClientId = newClient.id;
      }
    }

    // --- ESCENARIO B: El USUARIO acepta una petición enviada por un VETERINARIO ---
    else {
      console.log("entro", targetClientId);
      finalUserId = currentUserId; // El que acepta es el usuario
      // Aquí el clientId ya viene en la request porque el Vet la envió desde la ficha

      await supabase
        .from("Client")
        .update({ userid: finalUserId })
        .eq("id", targetClientId);
    }

    // --- COMÚN A AMBOS: Sincronizar Mascotas ---
    const { data: vetPets } = await supabase
      .from("PetClient")
      .select("petid")
      .eq("clientid", targetClientId);

    if (vetPets && vetPets.length > 0) {
      const petUserInserts = vetPets.map((pc) => ({
        petid: pc.petid,
        userid: finalUserId,
      }));
      // Insertamos relaciones PetUser (ignorando errores si ya existían)
      await supabase.from("PetUser").insert(petUserInserts);
    }

    // --- FINAL: Actualizar estado de la solicitud ---
    await supabase
      .from("AssociationRequest")
      .update({ status: "accepted", clientid: targetClientId })
      .eq("id", requestId);

    return { success: true };
  } catch (error) {
    console.error("Error en acceptAssociation:", error);
    throw error;
  }
}

/**
 * Cancela una solicitud de asociación que aún está pendiente.
 * @param requestId - ID de la solicitud en AssociationRequest
 */
export async function deleteAssociationRequest(requestId: string) {
  const { error } = await supabase
    .from("AssociationRequest")
    .delete()
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) {
    console.error("Error al cancelar la solicitud:", error);
    throw new Error("No se pudo cancelar la solicitud.");
  }
  return { success: true };
}

/**
 * Rompe el vínculo entre un Centro Veterinario y un Usuario.
 * @param request - El objeto de la solicitud aceptada que contiene clientId y useremail
 */
export async function unlinkAssociation(request: any) {
  const { clientid, useremail, senderid, id: requestId } = request;

  try {
    // 1. Buscamos el ID del usuario (lo necesitamos para borrar sus PetUser)
    // Buscamos en la ficha del cliente antes de ponerla a null
    const { data: clientData } = await supabase
      .from("Client")
      .select("userid, id")
      .eq("id", clientid)
      .single();

    if (!clientData || !clientData.userid) {
      throw new Error("No se encontró un usuario vinculado a este cliente.");
    }

    const currentUserId = clientData.userid;

    // 2. Quitamos el userid de la tabla Client
    const { error: clientError } = await supabase
      .from("Client")
      .update({ userid: null })
      .eq("id", clientid);

    if (clientError) throw clientError;

    // 3. Buscamos todas las mascotas compartidas (PetClient de este cliente)
    const { data: sharedPets } = await supabase
      .from("PetClient")
      .select("petid")
      .eq("clientid", clientid);

    if (sharedPets && sharedPets.length > 0) {
      const petIds = sharedPets.map((p) => p.petid);

      // 4. Eliminamos los registros en PetUser para ese usuario y esas mascotas
      const { error: petUserError } = await supabase
        .from("PetUser")
        .delete()
        .eq("userid", currentUserId)
        .in("petid", petIds);

      if (petUserError) throw petUserError;
    }

    // 5. Por último, eliminamos el registro de AssociationRequest
    // para que el flujo de botones vuelva a estado inicial (Solicitar)
    const { error: deleteReqError } = await supabase
      .from("AssociationRequest")
      .delete()
      .eq("id", requestId);

    if (deleteReqError) throw deleteReqError;

    return { success: true };
  } catch (error) {
    console.error("Error crítico al anular asociación:", error);
    throw error;
  }
}

/**
 Rechaza una solicitud de asociación.
 @param requestId - ID de la solicitud en AssociationRequest
 */
export async function rejectAssociationRequest(requestId: string) {
  const { error } = await supabase
    .from("AssociationRequest")
    .update({ status: "rejected" })
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) {
    console.error("Error al rechazar la solicitud:", error);
    throw new Error("No se pudo rechazar la solicitud.");
  }
  return { success: true };
}
