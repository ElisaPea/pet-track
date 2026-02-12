CREATE TABLE IF NOT EXISTS Pet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- que es UUID? es un identificador unico universal, útil para generar identificadores, en vez de usar numeros
    legalIdentifier VARCHAR(40) UNIQUE, -- obligatorio y unico
    name VARCHAR(40) NOT NULL, 
    species VARCHAR(40),  -- esto lo dejamos como un string, pero lo que molaría hacer es otra tabla de tipo species
    breed VARCHAR(40), -- lo mismo que el anterior
    birthDate DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)