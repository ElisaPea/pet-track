# 🐾 Plataforma de Mascotas – Resumen de Lógica de la API

## 🧠 Concepto Principal

El sistema se basa en una única entidad global de mascota:

- **Pet** → Identidad global de la mascota (virtual u oficial)
- **PetUser** → Relación personal entre un Usuario y una Mascota
- **PetClient** → Relación profesional entre un Centro Veterinario (vía Client) y una Mascota

Una mascota existe una sola vez en el sistema.
Usuarios y centros veterinarios se conectan a esa misma entidad.

---

# 🏗️ Filosofía del Modelo de Datos

- Una **Pet puede existir sin `legalIdentifier`** (mascota virtual).
- El **`legalIdentifier` (microchip/DNI)** hace que la mascota sea única globalmente.
- Una mascota puede existir:
  - Solo en el contexto del usuario
  - Solo en el contexto del centro veterinario
  - En ambos

`legalIdentifier` es `UNIQUE` pero NO obligatorio.

---

# 🔹 1️⃣ Creación de Usuario + Mascotas Virtuales (Sin Centro Vet)

## Flujo

1. El usuario crea una cuenta.
2. El usuario crea mascotas sin `legalIdentifier`.

## Comportamiento de la API

- Se crea un registro en `Pet` con `legalIdentifier = NULL`.
- Se crea la relación en `PetUser`.

## Resultado

La mascota existe únicamente en el contexto personal del usuario.

---

# 🔹 2️⃣ Usuario Añade `legalIdentifier` Más Adelante

## Flujo

El usuario edita su mascota y añade el microchip.

## Lógica de la API

1. Buscar en `Pet` por `legalIdentifier`.
2. Si existe:
   - Actualizar `PetUser.petId` al `Pet` encontrado.
   - Eliminar el `Pet` virtual anterior.
3. Si no existe:
   - Actualizar el `Pet` actual añadiendo el `legalIdentifier`.

## Resultado

No existen duplicados de mascotas con el mismo microchip.
Se mantiene la unicidad global.

---

# 🔹 3️⃣ Usuario Crea Mascota Estando Conectado a un Vet

## Regla

El `legalIdentifier` es obligatorio.

## Lógica de la API

1. Buscar `Pet` por `legalIdentifier`.
2. Si existe → crear solo `PetUser`.
3. Si no existe → crear `Pet` + `PetUser`.

## Resultado

Se mantiene una única identidad global por mascota.

---

# 🔹 4️⃣ Centro Veterinario Crea Cliente + Mascotas

## Regla

El `legalIdentifier` es siempre obligatorio.

## Lógica de la API

1. Buscar `Pet` por `legalIdentifier`.
2. Si existe → crear solo `PetClient`.
3. Si no existe → crear `Pet` + `PetClient`.
4. Si el `Client` tiene `userId` → crear también `PetUser`.

## Resultado

Las mascotas oficiales son únicas globalmente y compartidas entre contextos.

---

# 🔹 5️⃣ Usuario Quiere Conectarse a un Centro Veterinario

## Paso 1 — Emparejar User ↔ Client

La API busca si existe un `Client` en ese centro con el mismo email.

### Casos posibles:

1. ❌ No existe cliente  
   → El centro decide si crearlo y asignarle el `userId`.

2. ⚠ Existe cliente sin `userId`  
   → El centro decide si vincularlo al usuario.

3. ✅ Existe cliente con el mismo `userId`  
   → Ya están emparejados.

4. 🚫 Existe cliente con distinto `userId`  
   → Conflicto (resolución manual).

---

## Paso 2 — Reconciliar Mascotas

Antes de completar la vinculación, el usuario debe proporcionar los `legalIdentifier`.

Para cada mascota del usuario:

1. Buscar en `Pet` por `legalIdentifier`.
2. Si existe:
   - Reasignar `PetUser.petId` al `Pet` oficial.
   - Eliminar la mascota virtual duplicada.
3. Si no existe:
   - Actualizar el `Pet` actual añadiendo el `legalIdentifier`.

## Resultado Final

- No hay mascotas duplicadas.
- Existe una sola entidad `Pet` por microchip.
- Usuario y centro comparten la misma mascota global.

---

# 🧩 Reglas Fundamentales del Sistema

1. `Pet` es globalmente única por `legalIdentifier`.
2. `PetUser` y `PetClient` son relaciones contextuales.
3. Se permiten mascotas virtuales (`legalIdentifier = NULL`).
4. Las mascotas oficiales siempre requieren `legalIdentifier`.
5. En caso de conflicto, el sistema unifica hacia una única entidad `Pet`.

---

# 🎯 Objetivo del Diseño

El sistema permite:

- Onboarding sin fricción (mascotas virtuales).
- Validación progresiva al entrar en el ecosistema veterinario.
- Separación clara entre datos personales y datos clínicos.
- Una única fuente de verdad para cada animal real.
