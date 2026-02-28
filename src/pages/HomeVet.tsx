import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack, InputAdornment, IconButton } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets"; // Icono de la huellita
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

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
        </BasicScreen>
    );
}