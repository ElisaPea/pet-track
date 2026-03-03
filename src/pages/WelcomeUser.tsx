import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import BasicScreen from "../components/BasicScreen";

export default function WelcomeUser() {
  {
    /* Constants of Panel & Tabs*/
  }
  const [open, setOpen] = useState(false);
  const [tabActual, setTabActual] = useState(0);
  const [vacunas, setVacunas] = useState("");
  {
    /* Validations */
  }
  const [sumbitted, setSumbitted] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const nameValidation = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/.test(value)) {
      setNameError("❗ El nombre solo puede contener letras ❗");
    } else {
      setNameError("");
    }
    setName(value);
  };
  const onlyNumbers = (e: React.KeyboardEvent) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <BasicScreen>
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
              width: 75,
              height: 5,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
              mt: 1,
              ml: "auto",
              mr: "auto",
            }}
          ></Box>
        </Box>
        {/* Pet & Add Pet Boxes Container */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 7,
            columnGap: 8,
            rowGap: 3.5,
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
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FFFFFF",
                color: "black",
                borderRadius: 10,
                "&:hover": { bgcolor: "#FDC435" },
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
                rowGap: -2,
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
                <Typography variant="h6" textAlign="center">Vin</Typography>
                <Typography variant="body1" textAlign="left" sx={{ ml: 2 }}>- Shitzu</Typography>
                <Typography variant="body1" textAlign="left" sx={{ ml: 2 }}>- 4 años</Typography>
              </Box>
              {/* Pet Img Field */}
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1667411099198-a87e51e8c7b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                sx={{
                  borderRadius: 5,
                  width: 100,
                  height: 100,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                }}
              ></Box>
              {/* Pet Aditional Info Field */}
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 5,
                  width: 310,
                  height: 100,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Inserar informacion adicional</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Add Pet Panel */}
        <Dialog
          open={open}
          fullWidth
          maxWidth={false}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "#E4F7FB",
                width: { xs: "95vw", sm: "85vw", md: "75vw" },
                height: { xs: "90vh", sm: "85vh" },
                maxHeight: { xs: "90vh", sm: "85vh" },
                borderRadius: 5,
                padding: 0,
                overflow: "hidden",
              },
            },
          }}
        >
          {/* Tabs Container */}
          <Box sx={{ borderBottom: "2px solid black" }}>
            <Tabs
              value={tabActual}
              onChange={(e, newValue) => setTabActual(newValue)}
              TabIndicatorProps={{ sx: { display: "none" } }}
              variant="fullWidth"
            >
              <Tab
                label="Datos Mascota"
                sx={{
                  bgcolor: "#E4F7FB",
                  color: "black",
                  "&.Mui-selected": { bgcolor: "#BEF1F3", color: "black" },
                  "&:hover": { bgcolor: "#BEF1F3" },
                }}
              />
              <Tab
                label="Notas"
                sx={{
                  bgcolor: "#E4F7FB",
                  color: "black",
                  "&.Mui-selected": { bgcolor: "#BEF1F3", color: "black" },
                  "&:hover": { bgcolor: "#BEF1F3" },
                }}
              />
            </Tabs>
          </Box>
          {/* Tabs Content */}

          <Box
            sx={{
              px: { xs: 2, sm: 4, md: 6 },
              py: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto"
            }}
          >
            <Box sx={{ flex: 1 }}>
              {/* Pet Info Tab */}
              {tabActual == 0 && (
                <Box>
                  <Stack spacing={4} alignItems="center">
                    {/* Pet Name Field */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        sx={{
                          width: { xs: "100%", sm: 400 },
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        ¿Cual es el nombre de tu mascota?
                      </Typography>
                      <TextField
                        autoComplete="off"
                        value={name}
                        onChange={(e) => nameValidation(e.target.value)}
                        error={sumbitted && !!nameError}
                        helperText={sumbitted ? nameError : ""}
                        onClick={() => setSumbitted(false)}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          style: { color: "white" },
                        }}
                        sx={{
                          width: { xs: "100%", sm: 300 },
                          border:
                            sumbitted && nameError
                              ? "2px solid #F02F0A"
                              : "2px solid transparent",
                          bgcolor: "#685F5F",
                          borderRadius: 50,
                          px: 2,
                          py: 0.5,
                          ml: { xs: 0, sm: -12 },
                          "&:hover": { bgcolor: " #555353" },
                        }}
                      />
                    </Stack>
                    {/* Pet Img Field */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        sx={{
                          width: { xs: "100%", sm: 400 },
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        !Comparte fotos de tu mascota!
                      </Typography>
                      <Button
                        sx={{
                          color: "black",
                          fontSize: 50,
                          width: 100,
                          height: 90,
                          bgcolor: "#685F5F",
                          borderRadius: 10,
                          px: 2,
                          py: 0.5,
                          ml: { xs: 0, sm: -12 },
                          "&:hover": { bgcolor: "#555353" },
                        }}
                      >
                        +
                      </Button>
                    </Stack>
                    {/* Aditional Info Field */}
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        sx={{
                          width: 400,
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        Informacion adicional:
                      </Typography>
                    </Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexWrap="wrap"
                      gap={2}
                      sx={{ width: "100%", pt: -30 }}
                    >
                      {/* Age Field */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: "bold", minWidth: 50 }}>
                          Edad:
                        </Typography>
                        <TextField
                          autoComplete="off"
                          onKeyDown={onlyNumbers}
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            style: { color: "white" },
                          }}
                          slotProps={{ htmlInput: { maxLength: 2 } }}
                          sx={{
                            width: 60,
                            bgcolor: "#685F5F",
                            borderRadius: 50,
                            px: 2,
                            py: 0.5,
                            "&:hover": { bgcolor: "#555353" },
                          }}
                        />
                      </Stack>
                      {/* Weight Field */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: "bold", minWidth: 50 }}>
                          Peso:
                        </Typography>
                        <TextField
                          autoComplete="off"
                          onKeyDown={onlyNumbers}
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            style: { color: "white" },
                          }}
                          slotProps={{ htmlInput: { maxLength: 2 } }}
                          sx={{
                            width: 60,
                            bgcolor: "#685F5F",
                            borderRadius: 50,
                            px: 2,
                            py: 0.5,
                            "&:hover": { bgcolor: "#555353" },
                          }}
                        />
                      </Stack>
                      {/* Vacunas Field */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: "bold", minWidth: 80 }}>
                          ¿Vacunas?:
                        </Typography>
                        <Select
                          variant="standard"
                          disableUnderline
                          value={vacunas}
                          onChange={(e) => setVacunas(e.target.value)}
                          sx={{
                            width: 77,
                            bgcolor: "#685F5F",
                            borderRadius: 50,
                            px: 2,
                            py: 0.5,
                            "&:hover": { bgcolor: "#555353" },
                          }}
                        >
                          <MenuItem value="yes">Si</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </Stack>
                      {/* Breed Field */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: "bold", minWidth: 50 }}>
                          Raza:
                        </Typography>
                        <TextField
                          autoComplete="off"
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            style: { color: "white" },
                          }}
                          sx={{
                            width: 60,
                            bgcolor: "#685F5F",
                            borderRadius: 50,
                            px: 2,
                            py: 0.5,
                            "&:hover": { bgcolor: "#555353" },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              )}
              {/* Pet Notes Tab */}
              {tabActual == 1 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      columnGap: 8,
                      rowGap: 3,
                      mt: 3,
                    }}
                  >
                    {/* WHITE BOX */}
                    <Box
                      sx={{
                        bgcolor: "white",
                        height: 400,
                        width: { xs: "100%", sm: 450 },
                        borderRadius: 10,
                        overflow: "hidden",
                        px: 3.5,
                        py: 2,
                        border: "3px solid transparent",
                        "&:hover": { border: "3px solid #BEF1F3" },
                      }}
                    >
                      <Typography>Notas del centro vet:</Typography>
                      <TextField
                        multiline
                        rows={14}
                        fullWidth
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          style: { color: "black" },
                        }}
                        sx={{ mt: 1, mb: -1 }}
                      ></TextField>
                    </Box>
                    {/* WHITE BOX */}
                    <Box
                      sx={{
                        bgcolor: "white",
                        height: 400,
                        width: { xs: "100%", sm: 450 },
                        borderRadius: 10,
                        px: 3.5,
                        py: 2,
                        border: "3px solid transparent",
                        "&:hover": { border: "3px solid #BEF1F3" },
                      }}
                    >
                      <Typography>Notas del usuario:</Typography>
                      <TextField
                        multiline
                        rows={14}
                        fullWidth
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          style: { color: "black" },
                        }}
                        sx={{ mt: 1, mb: -1 }}
                      ></TextField>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 6,
                pb: 3,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: 125,
                  height: 35,
                  borderRadius: 50,
                  bgcolor: "#F02F0A",
                  "&:hover": { bgcolor: "#D82E0C" },
                }}
                onClick={() => {
                  setOpen(false);
                  setSumbitted(false);
                  setName("");
                  setNameError("");
                }}
              >
                SALIR
              </Button>
              <Button
                variant="contained"
                onClick={() => setSumbitted(true)}
                sx={{
                  width: 125,
                  height: 35,
                  borderRadius: 50,
                  bgcolor: "#FBC02D",
                  "&:hover": { bgcolor: "#f9a825" },
                  color: "black",
                }}
              >
                GUARDAR
              </Button>
            </Box>
          </Box>
        </Dialog>
      </section>
    </BasicScreen>
  );
}