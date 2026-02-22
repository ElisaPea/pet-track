import BasicScreen from "../components/BasicScreen";
import { Box, Typography, IconButton, Button, Stack } from "@mui/material";
import { Instagram, LinkedIn, Mail } from "@mui/icons-material";

export default function Welcome_User() {
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: -10
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                        Bienvenido ****
                    </Typography>
                </Box>
            </Box>
            <Box // pildora inferior del nombre
                sx={{
                    bgcolor: "#00ADBA", //color azul mas oscuro
                    borderRadius: "50px", // forma píldora
                    width: 75,
                    height: 5,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", //sombra
                    display: "flex", // centrado correcto
                    justifyContent: "center",
                    mt: -1.5,
                    ml: "auto",
                    mr: "auto"
                }}
            >
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mt: 7, // Margen superior para centrar visualmente
                    columnGap: 8,
                    rowGap: 3.5
                }}
            >
                <Box
                    sx={{
                        bgcolor: "#00ADBA", //color azul mas oscuro
                        borderRadius: 10, // forma píldora
                        width: 350,
                        height: 240,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", //sombra
                        display: "flex", // centrado correcto
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#FFFFFF",
                            color: "black",
                            borderRadius: 10,
                            "&:hover": { bgcolor: "#cdcdcd" }
                        }}
                    >
                        !AÑADE UNA MASCOTA!
                    </Button>
                </Box>

                <Box
                    sx={{
                        bgcolor: "#00ADBA", //color azul mas oscuro
                        borderRadius: 10, // forma píldora
                        width: 350,
                        height: 240,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", //sombra
                        display: "flex", // centrado correcto
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap",
                            mt: 1, // Margen superior para centrar visualmente
                            mb: 1,
                            columnGap: 1.5,
                            rowGap: -2
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 5,
                                width: 200,
                                height: 100,
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", //sombra
                            }}
                        >
                            <Typography
                                variant="h6" textAlign="center"
                            >
                                Vin
                            </Typography>
                            <Typography
                                variant="body1" textAlign="left" sx={{ ml: 2 }}
                            >
                                - Shitzu
                            </Typography>
                            <Typography
                                variant="body1" textAlign="left" sx={{ ml: 2 }}
                            >
                                - 4 años
                            </Typography>
                        </Box>

                        <Box
                            component="img"
                            src="https://images.unsplash.com/photo-1667411099198-a87e51e8c7b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            sx={{
                                borderRadius: 5,
                                width: 100,
                                height: 100,
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", //sombra
                            }}
                        >

                        </Box>

                        <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 5,
                                width: 310,
                                height: 100,
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", //sombra
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"

                            }}
                        >
                            <Typography
                                variant="h6"

                            >
                                Inserar informacion adicional
                            </Typography>

                        </Box>


                    </Box>

                </Box>
            </Box>
            <Box sx={{ mt: 25, textAlign: "center" }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <IconButton>
                        <Instagram />
                    </IconButton>
                    <IconButton>
                        <LinkedIn />
                    </IconButton>
                    <IconButton>
                        <Mail />
                    </IconButton>
                </Stack>
            </Box>
        </BasicScreen>
    );
}
