DROP TABLE IF EXISTS petUser;
CREATE TABLE petUser (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    petId UUID NOT NULL,
    userId UUID NOT NULL,
    extraFields TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (petId, userId), -- Un usuario solo puede ser dueño de una mascota una vez
    FOREIGN KEY (petId) REFERENCES Pet(id)
    ON DELETE RESTRICT -- No se puede borrar una mascota si tiene un dueño
    ON UPDATE CASCADE, -- Si se actualiza el id de una mascota, se actualiza el id de la mascota en la tabla PetClient
    FOREIGN KEY (userId) REFERENCES User(id)
    ON DELETE RESTRICT -- No se puede borrar un usuario si tiene una mascota
    ON UPDATE CASCADE -- Si se actualiza el id de un usuario, se actualiza el id del usuario en la tabla PetClient
);

