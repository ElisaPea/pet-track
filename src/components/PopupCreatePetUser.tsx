import {
  Box, Typography, Button, Stack, Dialog, Tabs, Tab,
  TextField, Select, MenuItem, Snackbar, Alert, CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getEtapaVida } from "../utils/getEtapaVida";
import { createPet, updatePet, updatePetUserNotas, getPetUserNotas } from "../api/query";

const TEST_USER_ID = "2427a02c-b1c9-423e-9aab-4ed448c34b5b";

interface MascotaExistente {
  id: string;
  name: string;
  breed?: string;
  birthdate?: string;
}

function edadDesde(birthdate?: string): string {
  if (!birthdate) return "";
  const años = new Date().getFullYear() - new Date(birthdate).getFullYear();
  return String(años);
}

export function PopupCreatePetUser({
  open,
  setOpen,
  mascota,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mascota?: MascotaExistente | null;
}) {
  const modoLectura = !!mascota;

  const [tabActual, setTabActual] = useState(0);
  const [vacunas, setVacunas] = useState("");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState("");
  const [peso, setPeso] = useState("");
  const [notasUser, setNotasUser] = useState("");
  const [name, setName] = useState("");

  const [nameError, setNameError] = useState("");
  const [razaError, setRazaError] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    raza: "",
    edad: "",
    notasUser: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (mascota) {
        const edadCalc = edadDesde(mascota.birthdate);

        setName(mascota.name || "");
        setRaza(mascota.breed || "");
        setEdad(edadCalc);

        const extras = await getPetUserNotas(mascota.id, TEST_USER_ID);
        setNotasUser(extras.notasUser || "");

        setOriginalData({
          name: mascota.name || "",
          raza: mascota.breed || "",
          edad: edadCalc,
          notasUser: extras.notasUser || "",
        });
      } else {
        setName("");
        setRaza("");
        setEdad("");
        setPeso("");
        setVacunas("");
        setNotasUser("");

        setOriginalData({
          name: "",
          raza: "",
          edad: "",
          notasUser: "",
        });
      }
    };

    loadData();
  }, [mascota]);

  const nameValidation = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value)) {
      setNameError("❗ El nombre solo puede contener letras ❗");
    } else {
      setNameError("");
    }
    setName(value);
  };

  const razaValidation = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value)) {
      setRazaError("❗ Solo letras ❗");
    } else {
      setRazaError("");
    }
    setRaza(value);
  };

  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    if (/^\d{0,2}$/.test(value)) {
      setter(value);
    }
  };

  const isFormValid =
    name &&
    !nameError &&
    edad &&
    peso &&
    raza &&
    !razaError &&
    vacunas;

  const hasChanges =
    name !== originalData.name ||
    raza !== originalData.raza ||
    edad !== originalData.edad ||
    notasUser !== originalData.notasUser;

  const handleGuardar = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - (parseInt(edad) || 0);
      const birthDate = `${birthYear}-01-01`;

      const pet = await createPet(
        { name, breed: raza, birthDate },
        TEST_USER_ID
      );

      await updatePetUserNotas(pet.id, TEST_USER_ID, notasUser);

      setToast({ open: true, message: "¡Mascota creada!", severity: "success" });
      setTimeout(() => setOpen(false), 1500);
    } catch {
      setToast({ open: true, message: "Error al guardar", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!mascota || !hasChanges) return;

    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - (parseInt(edad) || 0);
      const birthDate = `${birthYear}-01-01`;

      await updatePet(mascota.id, {
        name,
        breed: raza,
        birthDate,
      });

      await updatePetUserNotas(mascota.id, TEST_USER_ID, notasUser);

      setToast({ open: true, message: "¡Mascota actualizada!", severity: "success" });
      setTimeout(() => setOpen(false), 1500);
    } catch {
      setToast({ open: true, message: "Error al actualizar", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: "#E4F7FB",
            borderRadius: 5,
            height: "85vh",
            display: "flex",
            flexDirection: "column",
          }
        }}
      >
        <Box sx={{ borderBottom: "2px solid black" }}>
          <Tabs value={tabActual} onChange={(_, v) => setTabActual(v)} variant="fullWidth">
            <Tab label="Datos Mascota" />
            <Tab label="Notas" />
          </Tabs>
        </Box>

        <Box sx={{ p: 4, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {tabActual === 0 && (
            <>
              <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4, display: "flex", gap: 4, alignItems: "center", boxShadow: 1 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'gray' }}>Foto</Typography>
                  <Button sx={{ width: 120, height: 120, bgcolor: "#F7F9FA", border: "2px dashed #00ADBA", fontSize: 40 }}>+</Button>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>¿Cuál es el nombre de tu mascota?</Typography>
                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => nameValidation(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "#F7F9FA" } }}
                  />
                </Box>
              </Box>

              <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4, boxShadow: 1 }}>
                <Typography variant="h6" sx={{ color: "#00ADBA", fontWeight: "bold", mb: 3 }}>
                  Información adicional:
                </Typography>

                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Box sx={{ width: 80 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>Edad (años)</Typography>
                    <TextField
                      value={edad}
                      onChange={(e) => handleNumberInput(e.target.value, setEdad)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 10,
                          bgcolor: "#F7F9FA",
                        },
                      }}
                      inputProps={{ maxLength: 2 }}
                    />
                    <Typography variant="caption" sx={{ color: "#00ADBA" }}>
                      {getEtapaVida(edad)}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 80 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>Peso (kg)</Typography>
                    <TextField
                      value={peso}
                      onChange={(e) => handleNumberInput(e.target.value, setPeso)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 10,
                          bgcolor: "#F7F9FA",
                        },
                      }}
                      inputProps={{ maxLength: 2 }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>Raza</Typography>
                    <TextField
                      fullWidth
                      value={raza}
                      onChange={(e) => razaValidation(e.target.value)}
                      error={!!razaError}
                      helperText={razaError}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "#F7F9FA" } }}
                    />
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>¿Vacunas?</Typography>
                    <Select
                      fullWidth
                      value={vacunas}
                      onChange={(e) => setVacunas(e.target.value)}
                      sx={{ borderRadius: 10, bgcolor: "#F7F9FA" }}
                    >
                      <MenuItem value="yes">Sí</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </Box>
                </Stack>
              </Box>
            </>
          )}

          {tabActual === 1 && (
            <div>
              <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4, mb: 4 }}>
                <Typography sx={{ fontWeight: "bold", mb: 2 }}>Notas del propietario</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={notasUser}
                  onChange={(e) => setNotasUser(e.target.value)}
                />
              </Box>
              <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4 }}>
                <Typography sx={{ fontWeight: "bold", mb: 2 }}>Notas del centro veterinario</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  inputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </div>
          )}
        </Box>

        <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end", gap: 2, bgcolor: "white" }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>

          {!modoLectura && (
            <Button onClick={handleGuardar} disabled={loading || !isFormValid}>
              {loading ? <CircularProgress size={24} /> : "Guardar Mascota"}
            </Button>
          )}

          {modoLectura && (
            <Button
              onClick={handleUpdate}
              disabled={loading || !hasChanges || !!nameError || !!razaError}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar cambios"}
            </Button>
          )}
        </Box>
      </Dialog>

      <Snackbar open={toast.open}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
}