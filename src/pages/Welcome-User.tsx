import BasicScreenUser from "../components/BasicScreenUser";
import { Box, Typography, IconButton, Button, Stack, Dialog, Tabs, Tab } from "@mui/material";
import { Instagram, LinkedIn, Mail } from "@mui/icons-material";
import { useState } from "react";


export default function Welcome_User() {
    {/* Constants of Panel & Tabs*/ }
    const [open, setOpen] = useState(false);
    const [tabActual, setTabActual] = useState(0)
    return (
        <BasicScreenUser>
            <section>
                {/* Welcome User Title & Blue Line */}
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                            Bienvenido ****
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            bgcolor: "#00ADBA",
                            borderRadius: "50px",
                            width: 75, // line dimensions
                            height: 5,
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                            display: "flex",
                            justifyContent: "center",
                            mt: 1, // margin with the upper title 
                            ml: "auto", //margin with left & right borders
                            mr: "auto"
                        }}
                    >
                    </Box>
                </Box>
                {/* Pet & Add Pet Boxes Container */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 7,
                        columnGap: 8, // horizontal space betwen Pet Boxes
                        rowGap: 3.5 // vertical space between Pet Boxes
                    }}
                >
                    {/* Add Pet Box */}
                    <Box
                        sx={{
                            bgcolor: "#00ADBA",
                            borderRadius: 10,
                            width: 350,
                            height: 240,
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                            display: "flex",
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
                            onClick={() => setOpen(true)}
                        >
                            !AÑADE UNA MASCOTA!
                        </Button>
                    </Box>
                    {/* Pet Box */}
                    <Box
                        sx={{
                            bgcolor: "#00ADBA",
                            borderRadius: 10,
                            width: 350,
                            height: 240,
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                                mt: 1,
                                mb: 1,
                                columnGap: 1.5,
                                rowGap: -2
                            }}
                        >
                            {/* Pet Info Field */}
                            <Box
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 5,
                                    width: 200,
                                    height: 100,
                                    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                                }}
                            >
                                {/* Pet Name */}
                                <Typography
                                    variant="h6" textAlign="center"
                                >
                                    Vin
                                </Typography>
                                {/* Pet Breed */}
                                <Typography
                                    variant="body1" textAlign="left" sx={{ ml: 2 }}
                                >
                                    - Shitzu
                                </Typography>
                                {/* Pet Age */}
                                <Typography
                                    variant="body1" textAlign="left" sx={{ ml: 2 }}
                                >
                                    - 4 años
                                </Typography>
                            </Box>
                            {/* Pet Img Field */}
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
                            {/* Pet Aditional Info Field */}
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
                {/* Footer */}
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
                {/* Add Pet Panel */}
                <Dialog
                    open={open}
                    onClose={() => { setOpen(false); setTabActual(0); }}
                    fullWidth
                    maxWidth={false}
                    slotProps={{
                        paper: {
                            sx: {
                                width: "75vw",
                                height: "85vh",
                                maxHeight: "85vh",
                                borderRadius: 5,
                                padding: 0,
                                overflow: "hidden"
                            }
                        }
                    }}
                >
                    {/* Tabs Container */}
                    <Box sx={{ borderBottom: "2px solid black" }}>
                        <Tabs
                            value={tabActual}
                            onChange={(e, newValue) => setTabActual(newValue)}
                            TabIndicatorProps={{ sx: { display: "none" } }}

                        >
                            <Tab
                                label="Datos Mascota"
                                sx={{
                                    bgcolor: "white",
                                    color: "black",
                                    "&.Mui-selected": {
                                        bgcolor: "#00ADBA",
                                        color: "black",
                                    }
                                }}
                            />
                            <Tab
                                label="Notas"
                                sx={{
                                    bgcolor: "white",
                                    color: "black",
                                    "&.Mui-selected": {
                                        bgcolor: "#00ADBA",
                                        color: "black",
                                    }
                                }}
                            />
                            <Tab
                                label="PRUEBA"
                                sx={{
                                    bgcolor: "white",
                                    color: "black",
                                    "&.Mui-selected": {
                                        bgcolor: "#00ADBA",
                                        color: "black",
                                    }
                                }}
                            />
                        </Tabs>
                    </Box>
                    {/* Tabs Content */}
                    <Box sx={{ padding: 4 }}>
                        {tabActual == 0 && <Box>Hola</Box>}
                        {tabActual == 1 && <Box>Que tal?</Box>}
                        {tabActual == 2 && <Box>prueba?</Box>}
                    </Box>
                </Dialog>
            </section>
        </BasicScreenUser >
    );
}
