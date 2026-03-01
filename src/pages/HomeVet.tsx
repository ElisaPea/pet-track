import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack, InputAdornment, IconButton, Avatar } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets"; // Icono de la huellita
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'; // O usa otro icono de flecha si lo prefieres

export default function HomeVet() {
    return (
        <BasicScreen>
            {/* Welcome Vet Title & Blue Line */}
            <Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                        Bienvenido Malcon
                    </Typography>
                </Box>
                <Box
                    sx={{
                        bgcolor: "#00ADBA",
                        borderRadius: "50px",
                        width: 75,
                        height: 5,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                        mt: 1,
                        ml: "auto",
                        mr: "auto",
                    }}
                />
            </Box>

            {/* Actions Bar: Search and Create */}
            <Box
                sx={{
                    bgcolor: "#B2EBF2",
                    p: 4,
                    borderRadius: 8,
                    boxShadow: 1,
                    maxWidth: 450, // Limit the maximum width to prevent full-screen expansion.
                    mx: "auto", // "Horizontal centering
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3, // Gap between children
                }}
            >
                {/* 1. SEARCH SECTION */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Buscar cliente o mascota:
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Nombre, DNI o nombre de mascota..."
                        variant="outlined"
                        sx={{ bgcolor: "white", borderRadius: 50, "& fieldset": { border: "none" }, boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.05)" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* 2. ADD SECTION */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Agregar un nuevo cliente:
                    </Typography>
                    <IconButton
                        color="primary"
                        sx={{
                            bgcolor: "white",
                            boxShadow: 2,
                            "&:hover": { bgcolor: "#f5f5f5" },
                            width: 50,
                            height: 50
                        }}
                        onClick={() => console.log("Agregar cliente")}
                    >
                        <AddIcon sx={{ fontSize: 30, color: "#00ADBA" }} />
                    </IconButton>
                </Stack>
            </Box>
            {/* End of Actions Bar */}

            {/* Clients cards */}

            <Box
                sx={{
                    width: 320, // Ajusta el ancho según sea necesario
                    bgcolor: '#00ADBA', // Color de fondo turquesa del contenedor principal
                    borderRadius: 5, // Bordes redondeados del contenedor principal
                    p: 2, // Espaciado interno
                    display: 'flex',
                    flexDirection: 'column', // Disposición vertical de los elementos
                    gap: 1.5, // Espacio entre los dos bloques blancos
                }}
            >
                {/* 1. SECCIÓN SUPERIOR: Datos del Cliente */}
                <Box
                    sx={{
                        bgcolor: 'white', // Fondo blanco para el bloque superior
                        borderRadius: 3, // Bordes redondeados del bloque superior
                        p: 1.5, // Espaciado interno del bloque
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>
                                Cliente:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>
                                Paco
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>
                                DNI:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>
                                1234567
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* 2. SECCIÓN INFERIOR: Datos de la Mascota y Botón */}
                <Box
                    sx={{
                        bgcolor: 'white', // Fondo blanco para el bloque inferior
                        borderRadius: 3, // Bordes redondeados del bloque inferior
                        p: 1.5, // Espaciado interno del bloque
                        display: 'flex',
                        alignItems: 'center', // Alineación vertical de los elementos
                        gap: 1.5, // Espacio entre el avatar, el texto y el botón
                    }}
                >
                    <Avatar
                        src="https://images.dog.ceo/breeds/beagle/n02088358_1196.jpg" // Imagen de ejemplo
                        variant="rounded" // Esto hace que la imagen sea cuadrada con bordes redondeados
                        sx={{
                            width: 70, // Tamaño del avatar
                            height: 70, // Tamaño del avatar
                            borderRadius: '15px', // Bordes redondeados más sutiles
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>
                            Mascota 1:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500', color: 'black' }}>
                            Mojito
                        </Typography>
                    </Box>
                    <IconButton
                        sx={{
                            bgcolor: '#00ADBA', // Color de fondo turquesa del botón
                            color: 'white', // Color del icono
                            borderRadius: '50%', // Botón circular
                            p: 1, // Espaciado interno
                            ml: 2, // Margen izquierdo para separarlo
                        }}
                        onClick={() => console.log('Abrir popup de Mojito')}
                    >
                        <ArrowRightAltIcon /> {/* Icono de flecha */}
                    </IconButton>
                </Box>
            </Box>

        </BasicScreen>
    );
}