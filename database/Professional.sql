CREATE TABLE Professional (
    id integer PRIMARY KEY, 
    userId integer,
    veterinaryCenterId integer,
    licenseNumber VARCHAR(20),
    createdAt timestamp, 
    updatedAt timestamp
)