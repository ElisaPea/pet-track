import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";


export default function AccountSettingsVet() {
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
          {/* Tipografia actualizar perfil */}
            <Typography variant="h4" sx={{ fontWeight: "600", color: "#4A3B3B", mb: 0.5 }}>
              Actualiza tu perfil
            </Typography>

            {/* Línea decorativa */}
            <Box sx={{ width: 60, height: 4, bgcolor: "#00BCD4", mb: 4 }} />

        {/* Contenedor Principal (Cuadrado azul claro) */}
        <Box
          sx={{
            bgcolor: "#D1F2F5", // Azul pastel de la imagen
            width: "100%",
            maxWidth: 600,
            borderRadius: 10, // Bordes muy redondeados
            p: 4,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        
        >
          {/* Formulario */}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={3} alignItems="center">
              {/* Campo Correo */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Nombre:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "#6D5D5D",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    input: { 
                    color: "white", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>

              {/* Campo email */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Correo electrónico:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "#6D5D5D",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    input: { 
                    color: "white", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>


              
              {/* Campo telefono */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Número de teléfono:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard" 
                  defaultValue="+34 "
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "#6D5D5D",
                    borderRadius: 50,
                    width:"50%",
                    ml: "auto",
                    px: 1,
                    py: 0.4,
                    input: { 
                    color: "white", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>

              {/* Campo Dirección */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Dirección:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "#6D5D5D",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    input: { 
                    color: "white", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>
              
              {/* Campo Centro vet asociado */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Nº de colegiado:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "#6D5D5D",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    input: { 
                    color: "white", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>

              {/* Botón guardar*/}
              <Box sx={{ width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              pt: 2 }}>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#FBC02D", // Amarillo del botón "Acceder"
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    mb: 2,
                    border: "2px solid #64B5F6", // Borde azul del diseño
                    "&:hover": { bgcolor: "#f9a825" },
                  }}
                >
                  GUARDAR
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </BasicScreen>
  );
}
