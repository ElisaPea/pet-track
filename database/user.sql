-- Creacion del type user_role 
CREATE TYPE user_role AS ENUM ('user', 'profesional')

DROP TABLE IF EXISTS "User";
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name VARCHAR(60),
    phone VARCHAR(9), 
    email VARCHAR(100), 
    passwordHash BYTEA, -- He leido que almacenar los strings de hash en binrario es mas eficiente y ocupa menos espacio, funciona como un TEXT pero en binario.
    role user_role DEFAULT 'user', -- Definio que el rol por determinado sea user. 
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP, 
    lgpdConsent boolean,
    lgpdConsentDate timestamp,
    isActive boolean,
    deletedAt timestamp,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);