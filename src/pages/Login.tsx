import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets"; // Icono de la huellita

export default function Login() {
  return (
    <BasicScreen>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 8, // Margen superior para centrar visualmente
        }}
      >
        {/* Contenedor Principal (Cuadrado azul claro) */}
        <Box
          sx={{
            bgcolor: "#D1F2F5", // Azul pastel de la imagen
            width: "100%",
            maxWidth: 450,
            borderRadius: 10, // Bordes muy redondeados
            p: 4,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          {/* Header con Huellita */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "50%",
                p: 1,
                display: "flex",
                color: "#90CAF9",
              }}
            >
              <PetsIcon fontSize="large" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "500", color: "#333" }}>
              Accede a tu cuenta!
            </Typography>
          </Stack>

          {/* Formulario */}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={3} alignItems="center">
              {/* Campo Correo */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Correo:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>

              {/* Campo Password */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                >
                  Password:
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>

              {/* Botones */}
              <Box sx={{ width: "100%", pt: 2 }}>
                <Button
                  fullWidth
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
                  ACCEDER
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#9EABB3", // Gris del botón "Crear cuenta"
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#78909C" },
                  }}
                >
                  CREAR CUENTA
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </BasicScreen>
  );
}
