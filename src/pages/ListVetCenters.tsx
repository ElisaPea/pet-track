import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";



{/* Array nombres centro veterinarios*/}

const vetCentersData = [
    {id:1, nombre: "Centro Vet Animal Lovers", email: "contacto@animallovers.com"},
    {id:2, nombre: "Vet El bosque", email: "info@elbosque.es"},
    {id:3, nombre: "nombreVet", email: "info@vet.es"},
    {id:4, nombre: "nombreVet", email: "info@vet.es"},
    {id:5, nombre: "nombreVet", email: "info@vet.es"},
    {id:6, nombre: "nombreVet", email: "info@vet.es"}
]

export default function ListVetCenters() {
const handleEmail = (emailCentro: string, nombreCentro: string) => {
  console.log(`Enviando solicitud a: ${nombreCentro} (${emailCentro})`);
  window.location.href = `mailto:${emailCentro}?subject=Solicitud de Asociación&body=Hola, me gustaría asociarme a su centro...`;}


  return (
    <BasicScreen>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 8, // Margen superior para centrar visualmente
        }}

        >
          {/* Tipografia Asociarte a un centro veterinario */}
            <Typography variant="h4" sx={{ fontWeight: "600", color: "#000000", mb: 0.5 }}>
              Asociate a un centro veterinario
            </Typography>

            {/* Línea decorativa */}
            <Box sx={{ width: 60, height: 4, bgcolor: "#00BCD4", mb: 4 }} />

        {/* Contenedor Principal (Cuadrado azul claro) */}
        <Box
          sx={{
            bgcolor: "#D1F2F5", // Azul pastel de la imagen
            width: "100%",
            maxWidth: 700,
            borderRadius: 10, // Bordes muy redondeados
            p: 4,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        
        >
          {/* Formulario */}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={3} alignItems="center">
              {/* Busca tu centro */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 200, textAlign: "center", fontWeight: "bold", fontSize: "1.5rem"}}
                >
                  Busca tu centro:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Filtra la lista..." //conectar el buscador con onChange ={(e) =>setSearchTerm(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    // Añadimos la lupa para realizar busqueda
                     startAdornment: (
                    <SearchIcon sx={{ color: "black", ml: 1, opacity: 0.7 }} />
                     ),
                     }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    width:"50%",
                    ml: "auto",
                    input: { 
                    color: "black", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>
              </Stack>      
          </Box>
        {/* COMIENZA TABLA DE DATOS */}
        <Paper elevation={0} sx={{ border: "2px solid #333", borderRadius: 0, mt: 4}}>
          {vetCentersData.map((center, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: index !== vetCentersData.length - 1 ? "2px solid #333" : "none",
                bgcolor: "#D1F2F5", // Fondo grisáceo de la tabla
              }}
            >
              <Typography sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                {center.nombre}
              </Typography>

              <Button
                variant="contained"
                onClick={() => handleEmail(center.email, center.nombre)}
                sx={{
                  bgcolor: "#66BB6A", // Verde del botón
                  color: "black",
                  borderRadius: 50,
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  border: "1px solid #2E7D32",
                  "&:hover": { bgcolor: "#4CAF50" },
                }}
              >
                ENVIAR CORREO DE ASOCIACIÓN
              </Button>
            </Box>
          ))}
        </Paper>
        </Box> 
      </Box>
    </BasicScreen>
  );
}
