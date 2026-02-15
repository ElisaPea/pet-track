DROP TABLE IF EXISTS Professional;
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