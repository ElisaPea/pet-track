import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets"; // Icono de la huellita

export default function HomeUser() {
    return (
        <BasicScreen>
            <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Bienvenido Malcon
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "gray" }}>
                    Aquí puedes gestionar la salud de tus mascotas
                </Typography>
            </Box>

            <Box
                sx={{
                    bgcolor: "#D1F2F5",
                    p: 3,
                    borderRadius: 8,
                    boxShadow: 1,
                    mb: 4,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    ¿Qué deseas hacer?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        startIcon={<PetsIcon />}
                        sx={{
                            borderRadius: "50px",
                            textTransform: "none",
                            bgcolor: "white",
                            color: "black",
                        }}
                    >
                        Agregar mascota
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PetsIcon />}
                        sx={{
                            borderRadius: "50px",
                            textTransform: "none",
                            bgcolor: "white",
                            color: "black",
                        }}
                    >
                        Ver mascotas
                    </Button>
                </Stack>
            </Box>
        </BasicScreen>
    );
}