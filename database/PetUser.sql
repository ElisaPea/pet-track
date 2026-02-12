CREATE TABLE IF NOT EXISTS PetUser (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- que es UUID? es un identificador unico universal, útil para generar identificadores, en vez de usar numeros
    petId UUID NOT NULL,
    userId UUID NOT NULL,
    extraFields TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (petId) REFERENCES Pet(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (petId, userId) -- impide que un usuario tenga la misma mascota dos veces
)