CREATE TABLE User (
    id integer PRIMARY KEY, 
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