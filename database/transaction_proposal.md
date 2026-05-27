# Propuestas de Transacciones Atómicas (Supabase RPC)

Este documento presenta una propuesta técnica completa y en **orden de gravedad** para solucionar todas las vulnerabilidades de consistencia analizadas en `query_doc.md`.

En Supabase, al interactuar desde el frontend, **no se cuenta con soporte para transacciones ACID multi-consulta tradicionales desde JavaScript/TypeScript** (tipo `BEGIN ... COMMIT`). La solución oficial y más segura consiste en delegar estas operaciones a **Funciones de PostgreSQL (RPC)** o a **Disparadores (Triggers)** de la base de datos. Esto asegura que si cualquier sentencia falla, PostgreSQL realice un **Rollback** completo de forma automática.

---

## 1. [RIESGO CRÍTICO] Registro de Usuarios Profesional/Particular (`signUpComplete`)

### Problema actual
Si el usuario se registra exitosamente en Supabase Auth, pero la llamada posterior para crear la fila en `User` o `Professional` falla por red o datos inválidos, el usuario queda registrado en Auth pero sin perfil público. La cuenta queda rota e inservible, y ese email queda bloqueado para siempre en el registro.

### Solución propuesta: Trigger Automático (Disparador) en PostgreSQL
La mejor práctica absoluta en Supabase es usar un disparador en la base de datos sobre la tabla interna de usuarios de Auth. De este modo, en cuanto Supabase Auth crea el usuario, la propia base de datos se encarga de crear el perfil público e insertar en `Professional` de forma inmediata y 100% garantizada dentro de la misma transacción interna.

#### 1. Modificación en la llamada del Frontend (`src/api/signInQuery.tsx`)
Enviamos los campos del formulario como metadatos de usuario (`options.data`) dentro de la propia llamada de creación de Auth:
```typescript
export async function signUpComplete(formData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "user" | "professional";
  licenseNumber?: string;
  veterinaryCenterId?: string;
}) {
  // 1. Todo se pasa dentro del registro de Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        phone: formData.phone?.trim() || null,
        role: formData.role,
        license_number: formData.role === "professional" ? formData.licenseNumber : null,
        veterinary_center_id: formData.role === "professional" ? formData.veterinaryCenterId : null,
      }
    }
  });

  if (authError) throw authError;
  return authData;
}
```

#### 2. SQL a ejecutar en Supabase (SQL Editor)
Creamos una función disparadora que extraiga estos metadatos y los inserte en `User` y `Professional` de forma atómica:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_name VARCHAR;
  v_phone VARCHAR;
  v_role VARCHAR;
  v_license VARCHAR;
  v_center_id UUID;
BEGIN
  -- Extraer metadatos enviados desde el frontend
  v_name := COALESCE(new.raw_user_meta_data->>'name', 'Usuario nuevo');
  v_phone := new.raw_user_meta_data->>'phone';
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'user');
  v_license := new.raw_user_meta_data->>'license_number';
  v_center_id := (new.raw_user_meta_data->>'veterinary_center_id')::UUID;

  -- 1. Insertar perfil en la tabla User
  INSERT INTO public."User" (id, name, phone, role, lgpdconsent, lgpdconsentdate, isactive)
  VALUES (new.id, v_name, v_phone, v_role::user_role, true, NOW(), true);

  -- 2. Si el rol es profesional, insertar en la tabla Professional
  IF v_role = 'professional' THEN
    INSERT INTO public."Professional" (userid, licensenumber, veterinarycenterid)
    VALUES (new.id, v_license, v_center_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el Trigger sobre auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_trigger();
```

---

## 2. [RIESGO CRÍTICO] Aceptación de Solicitudes (`acceptAssociation`)

### Problema actual
Si tras asignar el cliente al usuario particular falla el paso de sincronizar sus mascotas en `PetUser` o actualizar la solicitud en `AssociationRequest`, el cliente se asocia pero la solicitud sigue en "Pendiente", permitiendo que se pulse el botón infinitas veces o corrompiendo la sincronización.

### Solución propuesta: RPC SQL
Mover toda la lógica a una función única de PostgreSQL.

#### 1. SQL a ejecutar en Supabase:
```sql
CREATE OR REPLACE FUNCTION accept_association_tx(
  p_request_id UUID,
  p_current_user_id UUID,
  p_target_vet_center_id UUID
) RETURNS VOID AS $$
DECLARE
  v_sender_id UUID;
  v_user_email VARCHAR;
  v_sender_role VARCHAR;
  v_client_id UUID;
  v_target_client_id UUID;
BEGIN
  -- 1. Obtener datos de la solicitud
  SELECT senderid, useremail, senderrole, clientid
  INTO v_sender_id, v_user_email, v_sender_role, v_client_id
  FROM public."AssociationRequest"
  WHERE id = p_request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La solicitud no existe o ya ha sido procesada.';
  END IF;

  -- 2. ESCENARIO A: El Profesional acepta petición de un Usuario
  IF v_sender_role = 'user' THEN
    SELECT id INTO v_target_client_id
    FROM public."Client"
    WHERE email = v_user_email AND veterinarycenterid = p_target_vet_center_id
    LIMIT 1;

    IF v_target_client_id IS NOT NULL THEN
      UPDATE public."Client"
      SET userid = v_sender_id, updatedat = CURRENT_TIMESTAMP
      WHERE id = v_target_client_id;
    ELSE
      INSERT INTO public."Client" (name, email, veterinarycenterid, userid)
      VALUES ('Cliente ' || split_part(v_user_email, '@', 1), v_user_email, p_target_vet_center_id, v_sender_id)
      RETURNING id INTO v_target_client_id;
    END IF;

  -- 3. ESCENARIO B: El Usuario acepta petición de un Veterinario
  ELSE
    v_target_client_id := v_client_id;
    
    UPDATE public."Client"
    SET userid = p_current_user_id, updatedat = CURRENT_TIMESTAMP
    WHERE id = v_target_client_id;
  END IF;

  -- 4. Sincronizar Mascotas en PetUser
  INSERT INTO public."PetUser" (petid, userid)
  SELECT petid, COALESCE(v_sender_id, p_current_user_id)
  FROM public."PetClient"
  WHERE clientid = v_target_client_id
  ON CONFLICT DO NOTHING;

  -- 5. Actualizar la solicitud de asociación
  UPDATE public."AssociationRequest"
  SET status = 'accepted', clientid = v_target_client_id, updatedat = CURRENT_TIMESTAMP
  WHERE id = p_request_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Código React (`src/api/createAssociationReq.tsx`):
```typescript
export async function acceptAssociation(
  requestId: string,
  currentUserId: string,
  targetVetCenterId?: string
) {
  const { error } = await supabase.rpc("accept_association_tx", {
    p_request_id: requestId,
    p_current_user_id: currentUserId,
    p_target_vet_center_id: targetVetCenterId || null,
  });

  if (error) {
    console.error("Error en acceptAssociation:", error);
    throw new Error("No se pudo completar la asociación de forma segura.");
  }
  return { success: true };
}
```

---

## 3. [RIESGO ALTO] Desvinculación de Cuentas (`unlinkAssociation`)

### Problema actual
Si tras desvincular al cliente (`userid = null`) falla el paso de borrar los accesos a mascotas en `PetUser`, el usuario particular seguirá viendo y editando de forma indebida las mascotas de la clínica.

### Solución propuesta: RPC SQL

#### 1. SQL a ejecutar en Supabase:
```sql
CREATE OR REPLACE FUNCTION unlink_association_tx(
  p_request_id UUID,
  p_client_id UUID
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- 1. Buscar el ID del usuario vinculado
  SELECT userid INTO v_user_id
  FROM public."Client"
  WHERE id = p_client_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró un usuario vinculado a este cliente.';
  END IF;

  -- 2. Quitar el userid de la tabla Client
  UPDATE public."Client"
  SET userid = NULL, updatedat = CURRENT_TIMESTAMP
  WHERE id = p_client_id;

  -- 3. Eliminar los accesos de PetUser
  DELETE FROM public."PetUser"
  WHERE userid = v_user_id 
    AND petid IN (SELECT petid FROM public."PetClient" WHERE clientid = p_client_id);

  -- 4. Eliminar la solicitud de asociación
  DELETE FROM public."AssociationRequest"
  WHERE id = p_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Código React (`src/api/createAssociationReq.tsx`):
```typescript
export async function unlinkAssociation(request: any) {
  const { id: requestId, clientid } = request;

  const { error } = await supabase.rpc("unlink_association_tx", {
    p_request_id: requestId,
    p_client_id: clientid,
  });

  if (error) {
    console.error("Error al desvincular:", error);
    throw new Error("No se pudo romper el vínculo de forma segura.");
  }
  return { success: true };
}
```

---

## 4. [RIESGO MEDIO] Creación de Mascota de Usuario (`createPet`)

### Problema actual
Si se registra la mascota en `Pet` pero falla la vinculación en `PetUser`, la mascota queda huérfana e invisible en la base de datos.

### Solución propuesta: RPC SQL

#### 1. SQL a ejecutar en Supabase:
```sql
CREATE OR REPLACE FUNCTION create_pet_tx(
  p_name VARCHAR,
  p_breed VARCHAR,
  p_birthdate DATE,
  p_weight INT,
  p_vaccines BOOLEAN,
  p_user_id UUID
) RETURNS json AS $$
DECLARE
  v_new_pet RECORD;
BEGIN
  INSERT INTO public."Pet" (name, breed, birthdate, weight, vaccines, isverified)
  VALUES (p_name, p_breed, p_birthdate, p_weight, p_vaccines, false)
  RETURNING id, name, breed, birthdate, weight, vaccines, isverified INTO v_new_pet;

  INSERT INTO public."PetUser" (petid, userid)
  VALUES (v_new_pet.id, p_user_id);

  RETURN row_to_json(v_new_pet);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Código React (`src/api/query.tsx`):
```typescript
export async function createPet(
  petData: {
    name: string;
    breed?: string;
    birthDate?: string;
    weight?: number;
    vaccines?: boolean;
  },
  userId: string,
) {
  if (!userId) throw new Error("No se ha detectado un usuario válido.");

  const { data, error } = await supabase.rpc("create_pet_tx", {
    p_name: petData.name,
    p_breed: petData.breed || null,
    p_birthdate: petData.birthDate || null,
    p_weight: petData.weight || null,
    p_vaccines: petData.vaccines || false,
    p_user_id: userId,
  });

  if (error) throw new Error("No se pudo registrar la mascota de forma atómica.");
  return data;
}
```

---

## 5. [RIESGO MEDIO] Creación de Mascota de Clínica (`createPetForClient`)

### Problema actual
Si falla la inserción en `PetClient` o `PetUser`, la mascota creada queda flotando libremente en la base de datos sin estar asignada a ninguna ficha de cliente de la clínica.

### Solución propuesta: RPC SQL

#### 1. SQL a ejecutar en Supabase:
```sql
CREATE OR REPLACE FUNCTION create_pet_for_client_tx(
  p_name VARCHAR,
  p_species VARCHAR,
  p_breed VARCHAR,
  p_birthdate DATE,
  p_client_id UUID,
  p_user_id UUID DEFAULT NULL
) RETURNS json AS $$
DECLARE
  v_new_pet RECORD;
BEGIN
  -- 1. Insertar Mascota
  INSERT INTO public."Pet" (name, species, breed, birthdate, isverified)
  VALUES (p_name, p_species, p_breed, p_birthdate, (p_user_id IS NOT NULL))
  RETURNING id, name, species, breed, birthdate, isverified INTO v_new_pet;

  -- 2. Vincular con PetClient (Obligatorio)
  INSERT INTO public."PetClient" (petid, clientid)
  VALUES (v_new_pet.id, p_client_id);

  -- 3. Vincular con PetUser (Si hay usuario asociado)
  IF p_user_id IS NOT NULL THEN
    INSERT INTO public."PetUser" (petid, userid)
    VALUES (v_new_pet.id, p_user_id);
  END IF;

  RETURN row_to_json(v_new_pet);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Código React (`src/api/query.tsx`):
```typescript
export async function createPetForClient(
  petData: {
    name: string;
    species?: string;
    breed?: string;
    birthdate?: string;
  },
  clientId: string,
  userId?: string | null,
) {
  if (!clientId) throw new Error("No se ha detectado un cliente válido.");

  const { data, error } = await supabase.rpc("create_pet_for_client_tx", {
    p_name: petData.name,
    p_species: petData.species || null,
    p_breed: petData.breed || null,
    p_birthdate: petData.birthdate || null,
    p_client_id: clientId,
    p_user_id: userId || null,
  });

  if (error) {
    console.error("Error en createPetForClient:", error);
    throw new Error("No se pudo registrar la mascota para la clínica.");
  }
  return data;
}
```

---

## 6. [RIESGO BAJO] Modificación de Perfil Veterinario (`updateVetProfile`)

### Problema actual
Si se actualiza la tabla de datos comunes `User` pero se cae la llamada para actualizar el número de licencia médica en `Professional`, se crea una inconsistencia en los datos del profesional.

### Solución propuesta: RPC SQL

#### 1. SQL a ejecutar en Supabase:
```sql
CREATE OR REPLACE FUNCTION update_vet_profile_tx(
  p_user_id UUID,
  p_name VARCHAR,
  p_phone VARCHAR,
  p_license_number VARCHAR
) RETURNS VOID AS $$
BEGIN
  -- 1. Actualizar tabla User
  UPDATE public."User"
  SET name = p_name, phone = p_phone, updatedat = CURRENT_TIMESTAMP
  WHERE id = p_user_id;

  -- 2. Actualizar tabla Professional
  UPDATE public."Professional"
  SET licensenumber = p_license_number, updatedat = CURRENT_TIMESTAMP
  WHERE userid = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Código React (`src/api/query.tsx`):
```typescript
export async function updateVetProfile(
  userId: string,
  updateData: { name: string; phone: string; licenseNumber: string },
) {
  const { error } = await supabase.rpc("update_vet_profile_tx", {
    p_user_id: userId,
    p_name: updateData.name,
    p_phone: updateData.phone,
    p_license_number: updateData.licenseNumber,
  });

  if (error) {
    console.error("Error al actualizar perfil:", error);
    throw new Error("No se pudieron guardar los cambios de forma segura.");
  }
}
```
