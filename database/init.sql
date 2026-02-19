--------------------------------------
---- SCRIPT CREACION DB PET-TRACK ----
--------------------------------------

-- INICIAMOS TRANSACCION, de esta manera controlamos que se ejecute todo correctamente o nada.
BEGIN;

-- ELIMINAMOS TABLAS EN ORDEN INVERSO, de esta manera suprimos las FOREIGN KEYS primero.
DROP TABLE IF EXISTS PetClient;
DROP TABLE IF EXISTS Professional;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS PetUser;
DROP TABLE IF EXISTS VeterinaryCenter;
DROP TABLE IF EXISTS Pet;
DROP TABLE IF EXISTS User;

--ELIMINAMOS EL TYPE ENUM, para poder volver a crearlo
DROP TYPE IF EXISTS user_role;

-- CREACION DEL TYPE ENUM user_role
CREATE TYPE user_role AS ENUM ('user', 'professional');

-- CREACION DE LAS TABLAS EN ORDEN DE DEPENDENCIA
CREATE TABLE "User" ( -- NEW: porque "User" está entre comillas?
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- NEW: supanase gestiona el auth, entonces no neceistamos guardar aquí la pass (es mala practica de hecho), solo hay que referenciar este id con el de supanbse: id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(60) NOT NULL, -- NEW: nombre es obligatorio
    phone VARCHAR(9), 
    email VARCHAR(100) UNIQUE NOT NULL,  -- NEW: esto se puede quitar, se guarda en tabla auth de supabase
    passwordHash BYTEA, --   NEW: esto se puede quitar, se guarda en tabla auth de supabase, He leido que almacenar los strings de hash en binrario es mas eficiente y ocupa menos espacio, en este caso utilizamos BYTEA que funciona como un TEXT bianrio
    role user_role DEFAULT 'user', -- Definio que el rol por determinado sea user. 
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP, 
    lgpdConsent boolean DEFAULT FALSE, -- NEW: AÑADIDO: por defecto false 
    lgpdConsentDate timestamp,
    isActive boolean, -- NEW: DUDA: esto para que era?
    deletedAt timestamp,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VeterinaryCenter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    email VARCHAR(100) UNIQUE NOT NULL, --NEW: para enlazar cliente y vet center, hay que enviar un correo, lo ideal es que se use uno que es del centro vet. un centro vet puede tener x profesionales, pero lo normal es que tenga un correo de empresa donde todos los profs tienen
    name VARCHAR(40), 
    address VARCHAR(100), 
    phone VARCHAR(9), 
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP, 
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Professional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    userId UUID NOT NULL,
    veterinaryCenterId UUID,
    licenseNumber VARCHAR(20),
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP, 
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, veterinaryCenterId), -- Un usuario solo puede ser un profesional en una veterinaria
    FOREIGN KEY (userId) REFERENCES User(id)
    ON DELETE CASCADE -- Si se borra el usuario, se borra el profesional ya que un profesional es un usuario
    ON UPDATE CASCADE, -- Si se actualiza el id del usuario, se actualiza el id del profesional
    FOREIGN KEY (veterinaryCenterId) REFERENCES VeterinaryCenter(id)
    ON DELETE SET NULL -- Si se borra la veterinaria, el profesional queda como "sin veterinaria", como si estuviera en paro
    ON UPDATE CASCADE -- Si se actualiza el id de la veterinaria, se actualiza el id del profesional
);



CREATE TABLE Client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    userId UUID,
    veterinaryCenterId  UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, 
    phone VARCHAR(20),
    extraInfo TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    FOREIGN KEY (veterinaryCenterId) REFERENCES VeterinaryCenter(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);


CREATE TABLE Pet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- que es UUID? es un identificador unico universal, útil para generar identificadores, en vez de usar numeros
    legalIdentifier VARCHAR(40) UNIQUE, -- unico pero NO OBLIGATORIO
    name VARCHAR(40) NOT NULL, 
    species VARCHAR(40),  -- esto lo dejamos como un string, pero lo que molaría hacer es otra tabla de tipo species
    breed VARCHAR(40), -- lo mismo que el anterior
    birthDate DATE,
    isVerified BOOLEAN DEFAULT FALSE, -- FALSE -> mascota creada por usuario que aún no tiene la relación de PetClient, TRUE -> mascota que tiene la relación de PetClient
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE PetUser (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- que es UUID? es un identificador unico universal, útil para generar identificadores, en vez de usar numeros
    petId UUID NOT NULL,
    userId UUID NOT NULL,
    extraFields TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (petId) REFERENCES Pet(id) ON DELETE RESTRICT ON UPDATE CASCADE, -- empleamos ON DELETE RESTRICT por buenas practicas y evitar eliminar registros accidentalmente. NEW: yo pondría on delete cascade porque si eliminamos la PET queremos que también se elimine la relación de PetUser
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE RESTRICT ON UPDATE CASCADE, -- NEW: yo pondría on delete cascade porque si eliminamos el usuario queremos que también se elimine la relación de PetUser
    UNIQUE (petId, userId) -- impide que un usuario tenga la misma mascota dos veces
);


CREATE TABLE PetClient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    petId UUID NOT NULL,
    clientId UUID NOT NULL,
    extraFields TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (petId) REFERENCES Pet(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE, -- NEW: yo pondría on delete cascade porque si eliminamos la PET queremos que también se elimine la relación de PetClientX
    FOREIGN KEY (clientId) REFERENCES Client(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE, -- NEW: yo pondría on delete cascade porque si eliminamos el cliente queremos que también se elimine la relación de PetClient
    UNIQUE (petId, clientId) 
);

-- CONFIRMAMOS CAMBIOS
COMMIT;