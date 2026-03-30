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
const TEST_USER_ID = "25a8fd56-fcf7-4629-a419-c5dd9f5891eb";

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
                        style: { color: "black" },
                      }}
                      sx={{
                        bgcolor: "white",
                        width: { xs: "100%", sm: 300 },
                        border:
                          sumbitted && nameError
                            ? "2px solid #F02F0A"
                            : "2px solid transparent",
                        borderRadius: 50,
                        px: 2,
                        py: 0.5,
                        ml: { xs: 0, sm: -12 },
                        "&:hover": { bgcolor: "#d5d5d5ff" },
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
                        bgcolor: "white",
                        borderRadius: 10,
                        px: 2,
                        py: 0.5,
                        ml: { xs: 0, sm: -12 },
                        "&:hover": { bgcolor: "#d5d5d5ff" },
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
                    <Stack
                      direction="column"
                      alignItems="flex-start"
                      spacing={0.5}
                      sx={{ position: "relative" }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: "bold", minWidth: 50 }}>
                          Edad:
                        </Typography>
                        <TextField
                          autoComplete="off"
                          onKeyDown={onlyNumbers}
                          value={edad}
                          onChange={(e) => setEdad(e.target.value)}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          slotProps={{ htmlInput: { maxLength: 2 } }}
                          sx={{
                            width: 60,
                            bgcolor: "white",
                            color: "black",
                            borderRadius: 50,
                            px: 2,
                            py: 0.5,
                            "&:hover": { bgcolor: "#d5d5d5ff" },
                          }}
                        />
                      </Stack>
                      {/* Texto de etapa de vida*/}
                      <Typography
                        sx={{
                          ml: 7,
                          fontSize: 13,
                          fontWeight: "bold",
                          color: "#00ADBA",
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          whiteSpace: "nowrap",
                          visibility: getEtapaVida(edad) ? "visible" : "hidden",
                        }}
                      >
                        {getEtapaVida(edad) || "placeholder"}
                      </Typography>
                    </Stack>
                    {/* Weight Field */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ fontWeight: "bold", minWidth: 50 }}>
                        Peso:
                      </Typography>
                      <TextField
                        autoComplete="off"
                        onKeyDown={onlyNumbers}
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        slotProps={{ htmlInput: { maxLength: 2 } }}
                        sx={{
                          width: 60,
                          bgcolor: "white",
                          color: "black",
                          borderRadius: 50,
                          px: 2,
                          py: 0.5,
                          "&:hover": { bgcolor: "#d5d5d5ff" },
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
                          bgcolor: "white",
                          borderRadius: 50,
                          px: 2,
                          py: 0.5,
                          "&:hover": { bgcolor: "#d5d5d5ff" },
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
                        value={raza}
                        onChange={(e) => setRaza(e.target.value)}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{
                          width: 100,
                          bgcolor: "white",
                          color: "black",
                          borderRadius: 50,
                          px: 2,
                          py: 0.5,
                          "&:hover": { bgcolor: "#d5d5d5ff" },
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
              gap: 6,
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
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
