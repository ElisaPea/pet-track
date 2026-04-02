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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { getEtapaVida } from "../utils/getEtapaVida";
import { createPet } from "../api/query";

// ID de prueba para Cypress/Pruebas funcionales
const TEST_USER_ID = "2427a02c-b1c9-423e-9aab-4ed448c34b5b";

export function PopupCreatePetUser({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [tabActual, setTabActual] = useState(0);
  const [vacunas, setVacunas] = useState("");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState("");
  const [peso, setPeso] = useState("");
  const [notasUser, setNotasUser] = useState("");

  const [sumbitted, setSumbitted] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  // Estados para el Toast (Snackbar)
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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

  // Función para manejar el guardado
  const handleGuardar = async () => {
    setSumbitted(true);

    // Validación básica antes de llamar a la API
    if (!name || nameError) {
      setToast({
        open: true,
        message: "Por favor, revisa el nombre de la mascota",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Calculamos fecha aproximada para cumplir con el tipo DATE de la DB
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - (parseInt(edad) || 0);
      const birthDate = `${birthYear}-01-01`;

      await createPet(
        {
          name: name,
          breed: raza,
          birthDate: birthDate,
        },
        TEST_USER_ID,
      );

      // Feedback de Éxito
      setToast({
        open: true,
        message: "¡Mascota creada!",
        severity: "success",
      });

      // Limpiamos y cerramos después de un breve delay para que vean el toast
      setTimeout(() => {
        setOpen(false);
        setName("");
        setEdad("");
        setRaza("");
        setPeso("");
        setNotasUser("");
        setSumbitted(false);
        setTabActual(0);
      }, 1500);
    } catch (error: any) {
      console.error("Error al guardar:", error);
      // Manejo dinámico de errores
      const errorMsg =
        error.message === "Failed to fetch"
          ? "Error de conexión con el servidor"
          : "No se pudo crear la mascota. Inténtalo de nuevo.";

      setToast({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            onChange={(_, newValue) => setTabActual(newValue)}
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
            overflowY: "auto",
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Pet Info Tab */}
            {tabActual == 0 && (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  py: 1,
                  px: { xs: 1, sm: 2, md: 4 },
                }}
              >
                {/* Tarjeta Datos Principales */}
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 5,
                    p: { xs: 3, md: 4 },
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 3, md: 6 },
                    alignItems: "center",
                    minHeight: 220,
                  }}
                >
                  {/* Pet Img (Ahora a la izquierda y más grande) */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 160,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: "text.secondary",
                        mb: 1.5,
                      }}
                    >
                      Foto de perfil
                    </Typography>
                    <Button
                      sx={{
                        color: "#00ADBA",
                        fontSize: 50,
                        width: 150,
                        height: 150,
                        bgcolor: "#F7F9FA",
                        borderRadius: 5,
                        border: "3px dashed #BEF1F3",
                        "&:hover": {
                          bgcolor: "#E4F7FB",
                          borderColor: "#00ADBA",
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>

                  {/* Pet Name */}
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#00ADBA",
                        mb: 2,
                      }}
                    >
                      ¿Cual es el nombre de tu mascota?
                    </Typography>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      value={name}
                      onChange={(e) => nameValidation(e.target.value)}
                      error={sumbitted && !!nameError}
                      helperText={sumbitted ? nameError : ""}
                      onClick={() => setSumbitted(false)}
                      variant="outlined"
                      slotProps={{
                        htmlInput: {
                          "data-testid": "input-pet-name",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 50,
                          bgcolor: "#F7F9FA",
                          height: 60,
                          fontSize: "1.2rem",
                          px: 2,
                          "& fieldset": {
                            borderColor:
                              sumbitted && nameError
                                ? "#F02F0A"
                                : "transparent",
                          },
                          "&:hover fieldset": {
                            borderColor: "#BEF1F3",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00ADBA",
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Tarjeta Información adicional */}
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 5,
                    p: { xs: 3, md: 4 },
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
                    flex: 1,
                    minHeight: 200,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#00ADBA",
                      mb: 4,
                    }}
                  >
                    Informacion adicional:
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "repeat(4, 1fr)",
                      },
                      gap: { xs: 3, md: 4 },
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Edad */}
                    <Box sx={{ position: "relative" }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          mb: 1.5,
                          fontSize: 16,
                          color: "text.secondary",
                        }}
                      >
                        Edad
                      </Typography>
                      <TextField
                        fullWidth
                        autoComplete="off"
                        onKeyDown={onlyNumbers}
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            maxLength: 2,
                            "data-testid": "input-pet-age",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 50,
                            bgcolor: "#F7F9FA",
                            "& fieldset": { borderColor: "transparent" },
                            "&:hover fieldset": { borderColor: "#BEF1F3" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#00ADBA",
                            },
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: "bold",
                          color: "#00ADBA",
                          position: "absolute",
                          bottom: -24,
                          left: 10,
                          visibility: getEtapaVida(edad) ? "visible" : "hidden",
                        }}
                      >
                        {getEtapaVida(edad) || "placeholder"}
                      </Typography>
                    </Box>

                    {/* Peso */}
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          mb: 1.5,
                          fontSize: 16,
                          color: "text.secondary",
                        }}
                      >
                        Peso (kg)
                      </Typography>
                      <TextField
                        fullWidth
                        autoComplete="off"
                        onKeyDown={onlyNumbers}
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            maxLength: 3,
                            "data-testid": "input-pet-weight",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 50,
                            bgcolor: "#F7F9FA",
                            "& fieldset": { borderColor: "transparent" },
                            "&:hover fieldset": { borderColor: "#BEF1F3" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#00ADBA",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Vacunas */}
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          mb: 1.5,
                          fontSize: 16,
                          color: "text.secondary",
                        }}
                      >
                        ¿Vacunas?
                      </Typography>
                      <Select
                        fullWidth
                        variant="outlined"
                        value={vacunas}
                        onChange={(e) => setVacunas(e.target.value)}
                        inputProps={{ "data-testid": "select-pet-vaccines" }}
                        sx={{
                          borderRadius: 50,
                          bgcolor: "#F7F9FA",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#BEF1F3",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#00ADBA",
                          },
                        }}
                      >
                        <MenuItem value="yes">Sí</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </Box>

                    {/* Raza */}
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          mb: 1.5,
                          fontSize: 16,
                          color: "text.secondary",
                        }}
                      >
                        Raza
                      </Typography>
                      <TextField
                        fullWidth
                        autoComplete="off"
                        value={raza}
                        onChange={(e) => setRaza(e.target.value)}
                        variant="outlined"
                        slotProps={{
                          htmlInput: {
                            "data-testid": "input-pet-breed",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 50,
                            bgcolor: "#F7F9FA",
                            "& fieldset": { borderColor: "transparent" },
                            "&:hover fieldset": { borderColor: "#BEF1F3" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#00ADBA",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
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
                      disabled
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
                      value={notasUser}
                      onChange={(e) => setNotasUser(e.target.value)}
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
              gap: 10,
              pb: 3,
            }}
          >
            <Button
              variant="contained"
              disabled={loading}
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
              onClick={handleGuardar}
              disabled={loading}
              data-testid="btn-save-pet"
              sx={{
                width: 125,
                height: 35,
                borderRadius: 50,
                bgcolor: "#FBC02D",
                "&:hover": { bgcolor: "#f9a825" },
                color: "black",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "GUARDAR"
              )}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Toast de Feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          data-testid="toast-feedback-message"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
