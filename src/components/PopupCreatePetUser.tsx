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
import { useState, useEffect } from "react";
import { getEtapaVida } from "../utils/getEtapaVida";
import {
  createPet,
  updatePet,
  updatePetUserNotas,
  getPetUserNotas,
  deletePetUser,
  handleImagePetUpload,
  handleDeleteImage, // Asegúrate de tenerla en tu query
} from "../api/query";
import { useAuth } from "../context/AuthContext";

interface MascotaExistente {
  id: string;
  name: string;
  breed?: string;
  birthdate?: string;
  associatedVet?: string | null;
  centerNotes?: string | null;
  weight?: number;
  vaccines?: boolean;
  imageurl?: string;
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
  const isAsociada = !!mascota?.associatedVet;

  const { userState } = useAuth();

  const [tabActual, setTabActual] = useState(0);
  const [vacunas, setVacunas] = useState("");
  const [edad, setEdad] = useState("");
  const [raza, setRaza] = useState("");
  const [peso, setPeso] = useState("");
  const [notasUser, setNotasUser] = useState("");
  const [notasCentro, setNotasCentro] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [nameError, setNameError] = useState("");
  const [razaError, setRazaError] = useState("");

  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    raza: "",
    edad: "",
    peso: "",
    vacunas: "",
    notasUser: "",
    imageUrl: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (mascota) {
        const edadCalc = edadDesde(mascota.birthdate);
        setName(mascota.name || "");
        setRaza(mascota.breed || "");
        setImageUrl(mascota.imageurl || "");
        setEdad(edadCalc);
        setNotasCentro(mascota.centerNotes || "");
        setPeso(String(mascota.weight || ""));
        setVacunas(mascota.vaccines ? "yes" : "no");

        const extras = await getPetUserNotas(mascota.id, userState?.id);
        setNotasUser(extras.notasUser || "");

        setOriginalData({
          name: mascota.name || "",
          raza: mascota.breed || "",
          edad: edadCalc,
          peso: String(mascota.weight || ""),
          vacunas: mascota.vaccines ? "yes" : "no",
          notasUser: extras.notasUser || "",
          imageUrl: mascota.imageurl || "",
        });
      } else {
        setName("");
        setRaza("");
        setEdad("");
        setImageUrl("");
        setPeso("");
        setVacunas("");
        setNotasUser("");

        setNotasCentro("");
        setOriginalData({
          name: "",
          raza: "",
          edad: "",
          peso: "",
          vacunas: "",
          notasUser: "",
          imageUrl: "",
        });
      }
    };
    loadData();
  }, [mascota, userState?.id]);

  const nameValidation = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value))
      setNameError("❗ El nombre solo puede contener letras ❗");
    else setNameError("");
    setName(value);
  };

  const razaValidation = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value))
      setRazaError("❗ Solo letras ❗");
    else setRazaError("");
    setRaza(value);
  };

  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    if (/^\d{0,2}$/.test(value)) setter(value);
  };

  const isFormValid = name && !nameError && !razaError;
  const hasChanges =
    name !== originalData.name ||
    raza !== originalData.raza ||
    edad !== originalData.edad ||
    peso !== originalData.peso ||
    vacunas !== originalData.vacunas ||
    notasUser !== originalData.notasUser ||
    imageUrl !== originalData.imageUrl;

  const handleGuardar = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - (parseInt(edad) || 0);
      const birthDate = `${birthYear}-01-01`;
      const pet = await createPet(
        {
          name,
          breed: raza,
          birthDate,
          weight: parseInt(peso) || 0,
          vaccines: vacunas === "yes",
          imageurl: imageUrl,
        },
        userState?.id,
      );
      await updatePetUserNotas(pet.id, userState?.id, notasUser);
      setToast({
        open: true,
        message: "¡Mascota creada!",
        severity: "success",
      });
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
        weight: parseInt(peso) || 0,
        imageurl: imageUrl,
        vaccines: vacunas === "yes",
      });

      await updatePetUserNotas(mascota.id, userState?.id, notasUser);
      setToast({
        open: true,
        message: "¡Mascota actualizada!",
        severity: "success",
      });
      setTimeout(() => setOpen(false), 1500);
    } catch {
      setToast({
        open: true,
        message: "Error al actualizar",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (isAsociada) {
      setToast({
        open: true,
        message:
          "⚠️ Mascota vinculada. Debes anular la asociación del centro primero.",
        severity: "error",
      });
      return;
    }
    // si no es una mascota vinculada llamamos al dialog de confirmDelete
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    try {
      await deletePetUser(mascota!.id, userState?.id);
      setToast({
        open: true,
        message: "Mascota eliminada correctamente",
        severity: "success",
      });
      setTimeout(() => setOpen(false), 1500);
    } catch {
      setToast({ open: true, message: "Error al eliminar", severity: "error" });
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
          },
        }}
      >
        <Box sx={{ borderBottom: "2px solid black" }}>
          <Tabs
            value={tabActual}
            onChange={(_, v) => setTabActual(v)}
            variant="fullWidth"
          >
            <Tab label="Datos Mascota" />
            <Tab label="Notas" />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 4,
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {modoLectura && isAsociada && (
            <Alert
              severity="info"
              sx={{
                borderRadius: 4,
                border: "1px solid #00ADBA",
                bgcolor: "white",
              }}
            >
              Esta mascota está gestionada por el centro:{" "}
              <strong>{mascota.associatedVet}</strong>. Ciertos campos médicos
              son solo de lectura.
            </Alert>
          )}

          {tabActual === 0 && (
            <>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 5,
                  p: 4,
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  boxShadow: 1,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold", color: "gray" }}
                  >
                    Foto
                  </Typography>
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      id="pet-image"
                      hidden
                      onChange={async (e) => {
                        const urlImage = await handleImagePetUpload(e);
                        if (urlImage) {
                          setImageUrl(urlImage);
                        }
                      }}
                    />

                    <label htmlFor="pet-image">
                      <Button
                        component="span"
                        sx={{
                          width: 120,
                          height: 120,
                          bgcolor: "#F7F9FA",
                          border: "2px dashed #00ADBA",
                          overflow: "hidden",
                          p: 0,
                          position: "relative",
                        }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="pet"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "+"
                        )}
                      </Button>
                    </label>

                    {imageUrl && (
                      <Typography
                        onClick={async () => {
                          await handleDeleteImage(imageUrl);
                          setImageUrl("");
                        }}
                        sx={{
                          fontSize: 12,
                          color: "#F02F0A",
                          cursor: "pointer",
                          mt: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Eliminar
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    ¿Cuál es el nombre de tu mascota?
                  </Typography>
                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => nameValidation(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    disabled={isAsociada}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        bgcolor: isAsociada ? "#F0F0F0" : "#F7F9FA",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{ bgcolor: "white", borderRadius: 5, p: 4, boxShadow: 1 }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#00ADBA", fontWeight: "bold", mb: 3 }}
                >
                  Información adicional:
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Box sx={{ width: 80 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      Edad (años)
                    </Typography>
                    <TextField
                      value={edad}
                      onChange={(e) =>
                        handleNumberInput(e.target.value, setEdad)
                      }
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
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      Peso (kg)
                    </Typography>
                    <TextField
                      value={peso}
                      onChange={(e) =>
                        handleNumberInput(e.target.value, setPeso)
                      }
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
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      Raza
                    </Typography>
                    <TextField
                      fullWidth
                      value={raza}
                      onChange={(e) => razaValidation(e.target.value)}
                      error={!!razaError}
                      helperText={razaError}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 10,
                          bgcolor: "#F7F9FA",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      ¿Vacunas?
                    </Typography>
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
                <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                  Notas del propietario
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={notasUser}
                  onChange={(e) => setNotasUser(e.target.value)}
                />
              </Box>
              <Box sx={{ bgcolor: "white", borderRadius: 5, p: 4 }}>
                <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                  Notas del centro veterinario
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  inputProps={{ readOnly: true }}
                  value={notasCentro}
                  placeholder={
                    isAsociada
                      ? "Cargando notas médicas..."
                      : "Mascota no asociada a ningún centro."
                  }
                />
              </Box>
            </div>
          )}
        </Box>

        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "white",
          }}
        >
          {modoLectura ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: isAsociada ? "#BDBDBD" : "#F02F0A",
                color: "white",
                borderRadius: 10,
                fontWeight: "bold",
                "&:hover": { bgcolor: isAsociada ? "#BDBDBD" : "#D82E0C" },
              }}
              onClick={handleEliminar}
            >
              {isAsociada ? "BLOQUEADO (MASCOTA ASOCIADA)" : "ELIMINAR MASCOTA"}
            </Button>
          ) : (
            <Box />
          )}
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            {!modoLectura && (
              <Button
                variant="contained"
                onClick={handleGuardar}
                disabled={loading || !isFormValid}
                sx={{ bgcolor: "#00ADBA", borderRadius: 10 }}
              >
                {loading ? <CircularProgress size={24} /> : "Guardar Mascota"}
              </Button>
            )}
            {modoLectura && (
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={loading || !hasChanges || !!nameError || !!razaError}
                sx={{ bgcolor: "#00ADBA", borderRadius: 10 }}
              >
                {loading ? <CircularProgress size={24} /> : "Guardar cambios"}
              </Button>
            )}
          </Stack>
        </Box>
      </Dialog>
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, bgcolor: "#E4F7FB", p: 1 } }}
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography fontWeight="bold">
            ¿Estás seguro de que quieres eliminar a{" "}
            <strong>{mascota?.name}</strong>?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={() => setConfirmDeleteOpen(false)}
              sx={{ color: "#00ADBA", fontWeight: "bold", borderRadius: 10 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              sx={{
                bgcolor: "#F02F0A",
                borderRadius: 10,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#D82E0C" },
              }}
            >
              Eliminar
            </Button>
          </Stack>
        </Box>
      </Dialog>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
}
