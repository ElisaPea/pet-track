DROP TABLE IF EXISTS VeterinaryCenter;
CREATE TABLE VeterinaryCenter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name VARCHAR(40), 
    address VARCHAR(100), 
    phone VARCHAR(9), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)