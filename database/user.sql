DROP TABLE IF EXISTS "User";
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name VARCHAR(60),
    phone VARCHAR(9), 
    email VARCHAR(100), 
    passwordHash VARCHAR(255),
    role ENUM('user', 'professional'),
    createdAt timestamp, 
    lgpdConsent boolean,
    lgpdConsentDate timestamp,
    isActive boolean,
    deletedAt timestamp,
    updatedAt timestamp
    

)