import BasicScreenUser from "../components/BasicScreenUser";
import { Box, Typography, IconButton, Button, Stack, Dialog, Tabs, Tab, TextField, Select, MenuItem } from "@mui/material";
import { Instagram, LinkedIn, Mail } from "@mui/icons-material";
import { useState } from "react";


export default function Welcome_User() {
    {/* Constants of Panel & Tabs*/ }
    const [open, setOpen] = useState(false);
    const [tabActual, setTabActual] = useState(0);
    const [vacunas, setVacunas] = useState("");
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
                                "&:hover": { bgcolor: "#FDC435" }
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
                    // aussence of onClose makes the pannel only close when clicked the exit button 
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
                                overflow: "hidden" // enables the blue bgColor of the tabs to use all of the space in the corners
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
                                        bgcolor: "#BEF1F3",
                                        color: "black",
                                    },
                                    "&:hover": { bgcolor: "#BEF1F3" }
                                }}
                            />
                            <Tab
                                label="Notas"
                                sx={{
                                    bgcolor: "white",
                                    color: "black",
                                    "&.Mui-selected": {
                                        bgcolor: "#BEF1F3",
                                        color: "black",
                                    },
                                    "&:hover": { bgcolor: "#BEF1F3" }
                                }}
                            />
                        </Tabs>
                    </Box>
                    {/* Tabs Content */}

                    <Box sx={{ // display "flex" & flexDirection "column" enables align vertically the children boxes
                        px: 6, py: 3, height: "100%", display: "flex", flexDirection: "column"
                    }}>
                        <Box sx={{
                            flex: 1 // fills all the empty space vertically after the button box begins
                        }}>
                            {/* Pet Info Tab */}
                            {tabActual == 0 && <Box>
                                <Stack spacing={5} /*space betwen rows*/ alignItems="center">
                                    {/* Pet Name Field */}
                                    <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                                        <Typography
                                            sx={{ width: 400, textAlign: "left", fontWeight: "bold" }}
                                        >
                                            ¿Cual es el nombre de tu mascota?
                                        </Typography>
                                        <TextField
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true, style: { color: "white" }  // color white letters
                                            }}
                                            sx={{
                                                width: 600,
                                                bgcolor: "#685F5F",
                                                borderRadius: 50,
                                                px: 2,
                                                py: 0.5,
                                                ml: -12, // position besides Typography
                                                "&:hover": { bgcolor: " #555353" }
                                            }}
                                        />
                                    </Stack>
                                    {/* Pet Img Field */}
                                    <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                                        <Typography
                                            sx={{ width: 400, textAlign: "left", fontWeight: "bold" }}
                                        >
                                            !Comparte una foto de tu mascota!
                                        </Typography>
                                        <Button // podria ser un icon button?
                                            sx={{
                                                color: "black",
                                                fontSize: 50,
                                                width: 100,
                                                height: 90,
                                                bgcolor: "#685F5F",
                                                borderRadius: 10,
                                                px: 2,
                                                py: 0.5,
                                                ml: -12, // position besides Typography
                                                "&:hover": { bgcolor: "#555353" }
                                            }}
                                        >
                                            +
                                        </Button>
                                    </Stack>
                                    {/* Aditional Info Field */}
                                    <Box sx={{ width: "100%"  /*use all horitzontal space*/ }} >
                                        <Typography
                                            sx={{ width: 400, textAlign: "left", fontWeight: "bold" }}
                                        >
                                            Informacion adicional:
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                                        {/* Age Field */}
                                        <Typography
                                            sx={{ width: 120, textAlign: "left", fontWeight: "bold" }}
                                        >
                                            Edad:
                                        </Typography>
                                        <TextField
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true, style: { color: "white" }  // color white letters
                                            }}
                                            sx={{
                                                width: 60,
                                                bgcolor: "#685F5F",
                                                borderRadius: 50,
                                                px: 2,
                                                py: 0.5,
                                                ml: -8, // position besides Typographyç
                                                "&:hover": { bgcolor: "#555353" }
                                            }}
                                        />
                                        {/* Weight Field */}
                                        <Typography
                                            sx={{ width: 120, textAlign: "left", fontWeight: "bold", ml: 4 }}
                                        >
                                            Peso:
                                        </Typography>
                                        <TextField
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true, style: { color: "white" }  // color white letters
                                            }}
                                            sx={{
                                                width: 60,
                                                bgcolor: "#685F5F",
                                                borderRadius: 50,
                                                px: 2,
                                                py: 0.5,
                                                ml: -8, // position besides Typography
                                                "&:hover": { bgcolor: "#555353" }
                                            }}
                                        />
                                        {/* Vacunas Field */}
                                        <Typography
                                            sx={{ width: 120, textAlign: "left", fontWeight: "bold", ml: 4 }}
                                        >
                                            ¿Vacunas?:
                                        </Typography>
                                        <Select // Combo box
                                            variant="standard"
                                            disableUnderline
                                            value={vacunas} // initial value equal to vacunas wich is ""
                                            onChange={(e) => setVacunas(e.target.value)} //on change set value of vacunas to the one selected
                                            sx={{
                                                width: 77,
                                                bgcolor: "#685F5F",
                                                borderRadius: 50,
                                                px: 2,
                                                py: 0.5,
                                                ml: -2, // position besides Typography
                                                "&:hover": { bgcolor: "#555353" }
                                            }}
                                        >
                                            <MenuItem value="yes">Si</MenuItem>
                                            <MenuItem value="no">No</MenuItem>
                                        </Select>
                                        {/* Breed Field */}
                                        <Typography
                                            sx={{ width: 120, textAlign: "left", fontWeight: "bold", ml: 4 }}
                                        >
                                            Raza:
                                        </Typography>
                                        <TextField
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: true, style: { color: "white" }  // color white letters
                                            }}
                                            sx={{
                                                width: 60,
                                                bgcolor: "#685F5F",
                                                borderRadius: 50,
                                                px: 2,
                                                py: 0.5,
                                                ml: -8, // position besides Typographyç
                                                "&:hover": { bgcolor: "#555353" }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Box>}
                            {/* Pet Notes Tab */}
                            {tabActual == 1 && <Box> </Box>}
                        </Box>
                        {/* Buttons */}
                        <Box sx={{ // fills the free space before the info and notes tabs  & make the buttons sit at the end of the axis
                            display: "flex", justifyContent: "flex-end", gap: 6, pb: 3
                        }}>
                            <Button
                                variant="contained"
                                sx={{
                                    width: 125,
                                    height: 35,
                                    borderRadius: 50,
                                    bgcolor: "#F02F0A",
                                    "&:hover": { bgcolor: "#D82E0C" },
                                }}
                                onClick={() => setOpen(false)}
                            >
                                SALIR
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    width: 125,
                                    height: 35,
                                    borderRadius: 50,
                                    bgcolor: "#FBC02D",
                                    "&:hover": { bgcolor: "#f9a825" },
                                    color: "black"
                                }}
                            >
                                GUARDAR
                            </Button>
                        </Box>
                    </Box>
                </Dialog>
            </section>
        </BasicScreenUser >
    );
}
