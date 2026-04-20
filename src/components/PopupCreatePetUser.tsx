import {
  Box, Typography, Button, Stack, Dialog, Tabs, Tab,
  TextField, Select, MenuItem, Snackbar, Alert, CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { getEtapaVida } from "../utils/getEtapaVida";
import { createPet } from "../api/query";

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
  const [edad, setEdad] = useState(modoLectura ? edadDesde(mascota?.birthdate) : "");
  const [raza, setRaza] = useState(modoLectura ? (mascota?.breed ?? "") : "");
  const [peso, setPeso] = useState("");
  const [notasUser, setNotasUser] = useState("");
  const [name, setName] = useState(modoLectura ? mascota?.name : "");
  const [nameError, setNameError] = useState("");
  const [sumbitted, setSumbitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const nameValidation = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value)) {
      setNameError("❗ El nombre solo puede contener letras ❗");
    } else {
      setNameError("");
    }
    setName(value);
  };

  const handleGuardar = async () => {
    setSumbitted(true);
    if (!name || nameError) return;

    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - (parseInt(edad) || 0);
      const birthDate = `${birthYear}-01-01`;
      await createPet({ name: name!, breed: raza, birthDate }, TEST_USER_ID);

      setToast({ open: true, message: "¡Mascota creada!", severity: "success" });
      setTimeout(() => setOpen(false), 1500);
    } catch (error: any) {
      setToast({ open: true, message: "Error al guardar", severity: "error" });
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
          sx: { bgcolor: "#E4F7FB", borderRadius: 5, height: "85vh", overflow: "hidden" }
        }}
      >
        <Box sx={{ borderBottom: "2px solid black" }}>
          <Tabs value={tabActual} onChange={(_, v) => setTabActual(v)} variant="fullWidth">
            <Tab label="Datos Mascota" />
            <Tab label="Notas" />
          </Tabs>
        </Box>

        <Box sx={{ p: 4, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          {tabActual === 0 && (
            <>
              {/* TARJETA 1: IDENTIDAD */}
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
                    disabled={modoLectura}
                    onChange={(e) => nameValidation(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    placeholder="Ej: Max"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "#F7F9FA" } }}
                  />
                </Box>
              </Box>

              {/* TARJETA 2: DETALLES TÉCNICOS */}
              <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4, boxShadow: 1 }}>
                <Typography variant="h6" sx={{ color: "#00ADBA", fontWeight: "bold", mb: 3 }}>
                  Información adicional:
                </Typography>

                <Stack direction="row" spacing={3} flexWrap="wrap">
                  {/* Edad */}
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>Edad (años)</Typography>
                    <TextField
                      fullWidth
                      value={edad}
                      disabled={modoLectura}
                      onChange={(e) => setEdad(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "#F7F9FA" } }}
                    />
                    <Typography variant="caption" sx={{ color: "#00ADBA", display: "block", mt: 0.5 }}>
                      {getEtapaVida(edad)}
                    </Typography>
                  </Box>

                  {/* Peso */}
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>Peso (kg)</Typography>
                    <TextField
                      fullWidth
                      value={peso}
                      disabled={modoLectura}
                      onChange={(e) => setPeso(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "#F7F9FA" } }}
                    />
                  </Box>

                  {/* Raza */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>Raza</Typography>
                    <TextField
                      fullWidth
                      value={raza}
                      disabled={modoLectura}
                      onChange={(e) => setRaza(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10, bgcolor: "#F7F9FA" } }}
                    />
                  </Box>

                  {/* Vacunas */}
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>¿Vacunas?</Typography>
                    <Select
                      fullWidth
                      value={vacunas}
                      disabled={modoLectura}
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
            <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4, flex: 1 }}>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>Notas del propietario</Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={notasUser}
                onChange={(e) => setNotasUser(e.target.value)}
                placeholder="Alergias, comportamiento, etc."
              />
            </Box>
          )}
        </Box>

        {/* Acciones */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end", gap: 2, bgcolor: "white" }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          {!modoLectura && (
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={loading}
              sx={{ bgcolor: "#00ADBA", borderRadius: 10, px: 4 }}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar Mascota"}
            </Button>
          )}
        </Box>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
}