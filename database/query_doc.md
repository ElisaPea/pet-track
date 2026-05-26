# Análisis de Transacciones y Consistencia de Base de Datos

Este documento analiza en detalle la robustez de las consultas de escritura en la aplicación **Pet Track**. El objetivo es identificar funciones de la API en las que se realizan múltiples operaciones sobre la base de datos de manera secuencial (multi-step) sin una gestión de transacciones atómicas. 

Cuando una de estas funciones falla a mitad de su ejecución, los pasos anteriores ya se han confirmado en la base de datos (pues Supabase ejecuta cada llamada de manera independiente e inmediata), dejando datos huérfanos, inconsistentes o flujos lógicos rotos.

---

## Índice de Funciones Críticas Analizadas

| Archivo | Función | Nivel de Riesgo | Consecuencia Principal de Fallo Parcial |
| :--- | :--- | :--- | :--- |
| `src/api/signInQuery.tsx` | `signUpComplete` | **Crítico** | Usuario registrado en Auth pero sin perfil en `User` o `Professional` (Cuenta rota). |
| `src/api/createAssociationReq.tsx` | `acceptAssociation` | **Crítico** | Asociación hecha y mascotas vinculadas, pero la solicitud sigue apareciendo como "Pendiente". |
| `src/api/createAssociationReq.tsx` | `unlinkAssociation` | **Alto** | Usuario desvinculado del centro, pero mantiene acceso a las mascotas en `PetUser`. |
| `src/api/query.tsx` | `createPet` | **Medio** | Mascota creada en `Pet` pero sin dueño en `PetUser` (Mascota fantasma/huérfana). |
| `src/api/query.tsx` | `createPetForClient` | **Medio** | Mascota creada en `Pet` pero no vinculada al cliente (`PetClient`) o dueño (`PetUser`). |
| `src/api/query.tsx` | `updateVetProfile` | **Bajo** | Perfil de `User` actualizado, pero la licencia en `Professional` no (Datos inconsistentes). |

---

## Análisis Detallado por Función

### 1. `src/api/signInQuery.tsx` -> `signUpComplete`
Esta función registra a un usuario (particular o profesional) en el sistema.

* **Flujo del proceso:**
  1. `supabase.auth.signUp`: Registra el email y contraseña en el sistema de autenticación de Supabase (creando el registro en `auth.users`).
  2. `supabase.from("User").insert`: Crea el perfil público del usuario en la tabla `public.User` (copiando el ID generado en Auth).
  3. `supabase.from("Professional").insert` *(Solo si el rol es profesional)*: Inserta el número de licencia y la vinculación con el centro en `public.Professional`.

* **¿Qué pasa si falla un paso intermedio?**
  * **Si falla el Paso 2 (Creación en `User`):** El usuario se registra correctamente en Supabase Auth y puede iniciar sesión, pero no existe fila correspondiente en `public.User`. La aplicación fallará constantemente al intentar consultar los datos básicos del perfil (nombre, teléfono), dejando al usuario en un estado "roto" donde no puede utilizar la app ni volver a registrarse con ese email.
  * **Si falla el Paso 3 (Creación en `Professional`):** El usuario profesional se crea en Auth y en `public.User`, pero no tiene ficha en `public.Professional`. No podrá ver ni gestionar los clientes de su centro veterinario y la aplicación no sabrá a qué centro pertenece.

* **Riesgo:** **Crítico** 🚨

---

### 2. `src/api/createAssociationReq.tsx` -> `acceptAssociation`
Esta función procesa la aceptación de una solicitud de asociación entre un usuario particular y un centro veterinario.

* **Flujo del proceso:**
  1. **Si inicia el usuario (`senderrole === "user"`):**
     * Busca al cliente por email y centro.
     * Si existe: actualiza `public.Client` asignándole el `userid`.
     * Si no existe: inserta un nuevo registro en `public.Client`.
  2. **Si inicia el profesional (`senderrole !== "user"`):**
     * Actualiza `public.Client` asignándole el `userid` (recibido por parámetro).
  3. **Sincronización de mascotas:** Consulta `public.PetClient` para obtener las mascotas del cliente.
  4. **Relación PetUser:** Inserta filas en `public.PetUser` para otorgarle acceso al usuario a las mascotas en la app móvil.
  5. **Actualizar estado:** Cambia el estado de `public.AssociationRequest` a `accepted` y le asocia el `clientid`.

* **¿Qué pasa si falla un paso intermedio?**
  * **Si falla el Paso 4 (Vincular mascotas):** El cliente se asocia correctamente al usuario (`userid` guardado), pero las mascotas de la clínica veterinaria no se vinculan al usuario particular. El usuario verá que su cuenta está asociada al centro pero su lista de mascotas estará vacía.
  * **Si falla el Paso 5 (Actualizar solicitud):** Este es el fallo más crítico. El cliente está asociado, el usuario tiene acceso a las mascotas en `PetUser`, pero en `AssociationRequest` la solicitud **sigue apareciendo como "Pendiente"**. En la interfaz del veterinario o del usuario, el botón de "Aceptar" seguirá disponible. Si vuelven a pulsar "Aceptar", se duplicarán consultas o fallará, causando gran confusión logística.

* **Riesgo:** **Crítico** 🚨

---

### 3. `src/api/createAssociationReq.tsx` -> `unlinkAssociation`
Esta función rompe la vinculación entre un centro veterinario y un cliente.

* **Flujo del proceso:**
  1. Consulta `public.Client` para conseguir el `userid`.
  2. Actualiza `public.Client` poniendo `userid = null` (desvinculando la cuenta).
  3. Busca las mascotas compartidas (`public.PetClient`).
  4. Elimina la relación en `public.PetUser` para revocar el acceso del usuario a las mascotas del centro.
  5. Elimina el registro en `public.AssociationRequest` para reiniciar el flujo de botones a "Solicitar".

* **¿Qué pasa si falla un paso intermedio?**
  * **Si falla el Paso 4 (Eliminar PetUser):** La cuenta del cliente queda desvinculada (ya no tiene `userid`), pero las relaciones en `public.PetUser` **no se borran**. Esto genera una vulnerabilidad de seguridad/privacidad: el usuario particular seguirá viendo y editando las mascotas del centro veterinario a pesar de que la clínica canceló la asociación.
  * **Si falla el Paso 5 (Eliminar solicitud):** El cliente se desvincula y el usuario pierde el acceso a las mascotas, pero la solicitud de asociación no se borra. La interfaz se congelará en un estado inconsistente donde el usuario no podrá volver a solicitar la asociación porque el registro viejo aún persiste.

* **Riesgo:** **Alto** ⚠️

---

### 4. `src/api/query.tsx` -> `createPet`
Esta función crea una mascota desde el perfil del usuario.

* **Flujo del proceso:**
  1. Inserta la mascota en `public.Pet`.
  2. Inserta la relación en `public.PetUser` asociándola al `userId`.

* **¿Qué pasa si falla un paso intermedio?**
  * **Si falla el Paso 2:** La mascota se crea exitosamente en la tabla `Pet`, pero la relación con el usuario no se concreta. El usuario recibirá un error de guardado, la mascota nunca aparecerá en su pantalla, y se habrá creado una **mascota fantasma (huérfana)** en la base de datos que consume espacio pero que es inaccesible.

* **Riesgo:** **Medio** ⚡

---

### 5. `src/api/query.tsx` -> `createPetForClient`
Esta función la utiliza la veterinaria para registrar una mascota a nombre de una ficha de cliente.

* **Flujo del proceso:**
  1. Inserta la mascota en `public.Pet`.
  2. Inserta la relación en `public.PetClient`.
  3. *(Si hay userId)*: Inserta la relación en `public.PetUser` para sincronización.

* **¿Qué pasa si falla un paso intermedio?**
  * **Si falla el Paso 2:** La mascota se crea en `public.Pet`, pero no se vincula al cliente. Queda huérfana en la base de datos, la veterinaria no la ve en la ficha y no se le puede asignar historial.
  * **Si falla el Paso 3:** La mascota se crea y se asigna al cliente (la veterinaria la ve), pero no se vincula al usuario particular. El dueño no verá la nueva mascota en su aplicación móvil.

* **Riesgo:** **Medio** ⚡

---

### 6. `src/api/query.tsx` -> `updateVetProfile`
Actualiza el perfil de un veterinario.

* **Flujo del proceso:**
  1. Actualiza nombre y teléfono en `public.User`.
  2. Actualiza el número de licencia en `public.Professional`.

* **¿Qué pasa si falla un paso intermedio?**
  * **Si falla el Paso 2:** Se actualiza el nombre y teléfono del profesional, pero la licencia médica se mantiene antigua o sin cambios. Causa una inconsistencia de datos menor, pero no rompe el uso básico de la aplicación.

* **Riesgo:** **Bajo** 🟢
