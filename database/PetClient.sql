DROP TABLE IF EXISTS PetClient;
CREATE TABLE PetClient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    petId UUID NOT NULL,
    clientId UUID NOT NULL,
    extraFields TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (petId, clientId), -- Para que no se pueda repetir la misma mascota con el mismo cliente
    FOREIGN KEY (petId) REFERENCES Pet(id)
    ON DELETE RESTRICT -- No se puede borrar una mascota si tiene un cliente asociado
    ON UPDATE CASCADE, -- Si se actualiza el id de la mascota, se actualiza en esta tabla
    FOREIGN KEY (clientId) REFERENCES Client(id)
    ON DELETE RESTRICT -- No se puede borrar un cliente si tiene una mascota asociada
    ON UPDATE CASCADE -- Si se actualiza el id del cliente, se actualiza en esta tabla
);

