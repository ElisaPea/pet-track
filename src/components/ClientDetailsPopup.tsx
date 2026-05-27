import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Collapse,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import {
  updateClientProfile,
  createPetForClient,
  getPetUserNotas,
  updatePet,
  updatePetVetNotes,
  handleImagePetUpload,
  handleDeleteImage,
} from "../api/query";
import { validateEmail, validatePhone } from "../utils/validationUtils";
import { validateName } from "../utils/validatorName";
import { useAssociation } from "../context/AssociationContext";
import {
  createAssociationRequest,
  unlinkAssociation,
} from "../api/createAssociationReq";
import { useAuth } from "../context/AuthContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ClientDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  clientData: any | null;
  vetCenterId: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ClientDetailsPopup: React.FC<ClientDetailsPopupProps> = ({
  open,
  onClose,
  clientData,
  vetCenterId,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const { pendingRequests, acceptedRequests, refreshAssociations } =
    useAssociation();
  //m
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorFormat, setErrorFormat] = useState<string | null>(null);
  //m

  //v
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  //v
  const [loadingAction, setLoadingAction] = useState(false);
  const { userState } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [localPets, setLocalPets] = useState<any[]>([]);
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [petsExtras, setPetsExtras] = useState<Record<string, string>>({});

  const isAssociated = !!clientData?.userid;

  if (open) console.log(pendingRequests, clientData);

  const pendingRequest = pendingRequests.find(
    (r) => r.useremail === clientData?.email,
  );
  const acceptedRequest = acceptedRequests.find(
    (r) => r.clientid === clientData?.id,
  );

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
      });
      setLocalPets(clientData.pets || []);
      fetchPetsExtras();
    }
  }, [clientData]);

  const fetchPetsExtras = async () => {
    if (!clientData?.pets || !clientData.userid) return;
    const extras: Record<string, string> = {};
    for (const pet of clientData.pets) {
      try {
        const data = await getPetUserNotas(pet.id, clientData.userid);
        extras[pet.id] = data.notasUser;
      } catch (e) {
        console.error(e);
      }
    }
    setPetsExtras(extras);
  };

  //malcon
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(false);
    if (e.target.name === "phone" && errorPhone) setErrorPhone(false);
    if (e.target.name === "phone" && errorFormat) setErrorFormat(null);
  };

  const handleChangeName = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value)) {
      setNameError("El nombre solo puede contener letras.");
    } else {
      setNameError("");
    }
    setFormData({ ...formData, name: value });
  };

  const handleChangeEmail = (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("El correo no es válido.");
    } else {
      setEmailError("");
    }
    setFormData({ ...formData, email: value });
  };

  const handleChangePhone = (value: string) => {
    if (/[^\d]/.test(value) || value.length > 16) return;
    if (value && value.length < 4) {
      setPhoneError("El teléfono debe tener mínimo 4 dígitos.");
    } else {
      setPhoneError("");
    }
    setFormData({ ...formData, phone: value });
  };

  const handleAddNewPetRow = () => {
    // Evitar crear otra fila si ya hay una nueva sin nombre
    const hasUnfinishedNewPet = localPets.some(
      (p) => p.isNew && p.name.trim() === "",
    );
    if (hasUnfinishedNewPet) return;

    const tempId = "new-" + Date.now();
    const newPet = {
      id: tempId,
      name: "",
      species: "",
      breed: "",
      birthdate: "",
      vetNotes: "",
      isNew: true,
    };
    setLocalPets([newPet, ...localPets]);
    setExpandedPetId(tempId);
  };

  const handlePetChange = (id: string, field: string, value: string) => {
    setLocalPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = async () => {
    if (!clientData?.id) return;

    // Validar teléfono antes de guardar
    if (!validatePhone(formData.phone)) {
      setErrorPhone(true);
      setErrorFormat("Formato incorrecto en: Número de teléfono.");
      return;
    }
    setErrorPhone(false);
    setErrorFormat(null);
    if (nameError || emailError || phoneError) return;
    setLoadingAction(true);

    try {
      await updateClientProfile(clientData.id, formData);

      for (const pet of localPets) {
        const sanitizedDate =
          pet.birthdate && pet.birthdate.trim() !== "" ? pet.birthdate : null;

        if (pet.isNew) {
          if (pet.name.trim()) {
            const createdPet = await createPetForClient(
              { ...pet, birthdate: sanitizedDate },
              clientData.id,
              clientData.userid,
            );
            if (pet.vetNotes && createdPet?.id) {
              await updatePetVetNotes(
                createdPet.id,
                clientData.id,
                pet.vetNotes,
              );
            }
          }
        } else {
          await updatePet(pet.id, {
            name: pet.name,
            breed: pet.breed,
            birthDate: sanitizedDate,
            imageurl: pet.imageurl,
          });
          await updatePetVetNotes(pet.id, clientData.id, pet.vetNotes);
        }
      }
      await refreshAssociations();
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Error al guardar cambios.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInvite = async () => {
    setLoadingAction(true);
    try {
      await createAssociationRequest(
        vetCenterId,
        formData.email,
        userState?.vetCenterEmail || "",
        "professional",
        clientData.id,
      );
      await refreshAssociations();
      alert("Invitación enviada");
    } catch (e) {
      console.error(e);
    }
    setLoadingAction(false);
  };

  const handleUnlink = async () => {
    if (!acceptedRequest) return;
    if (window.confirm("¿Anular asociación?")) {
      setLoadingAction(true);
      await unlinkAssociation(acceptedRequest);
      await refreshAssociations();
      window.location.reload();
    }
  };

  const handleExit = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleExit}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 5, bgcolor: "#E1F5FE", height: "90vh" },
      }}
    >
      <Box
        sx={{
          borderBottom: 2,
          borderColor: "black",
          bgcolor: "#E1F5FE",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          TabIndicatorProps={{ sx: { display: "none" } }}
        >
          <Tab label="Datos cliente" sx={{ fontWeight: "bold" }} />
          <Tab label="Mascotas" sx={{ fontWeight: "bold" }} />
        </Tabs>

        <Stack direction="row" spacing={2} alignItems="center">
          {tabValue === 1 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNewPetRow}
              sx={{
                bgcolor: "#66BB6A",
                borderRadius: 10,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Añadir Mascota
            </Button>
          )}
          {isAssociated && (
            <Chip
              icon={<VerifiedUserIcon sx={{ color: "white !important" }} />}
              label="VINCULADO"
              sx={{ bgcolor: "#66BB6A", color: "white", fontWeight: "bold" }}
            />
          )}
        </Stack>
      </Box>

      <DialogContent sx={{ bgcolor: "#E1F5FE", p: 0 }}>
        <TabPanel value={tabValue} index={0}>
          <Collapse in={Boolean(errorFormat)}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 5 }}>
              {errorFormat}
            </Alert>
          </Collapse>

          <Stack spacing={3} sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
            {/* Nombre */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Nombre</Typography>
              <Box sx={{ width: 350 }}>
                <TextField
                  name="name"
                  size="small"
                  variant="standard"
                  value={formData.name}
                  onChange={(e) => handleChangeName(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                    width: "100%",
                  }}
                />
                {nameError && (
                  <Typography
                    sx={{ color: "red", fontSize: "0.75rem", ml: 2, mt: 0.5 }}
                  >
                    {nameError}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Email */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Email</Typography>
              <Box sx={{ width: 350 }}>
                <TextField
                  name="email"
                  size="small"
                  variant="standard"
                  value={formData.email}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                    width: "100%",
                  }}
                />
                {emailError && (
                  <Typography
                    sx={{ color: "red", fontSize: "0.75rem", ml: 2, mt: 0.5 }}
                  >
                    {emailError}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Teléfono */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Teléfono</Typography>
              <TextField
                name="phone"
                size="small"
                variant="standard"
                value={formData.phone}
                onChange={handleChange}
                error={errorPhone}
                InputProps={{ disableUnderline: true }}
                sx={{
                  bgcolor: errorPhone ? "#FFEBEE" : "white",
                  borderRadius: 50,
                  px: 2,
                  py: 0.5,
                  width: 150,
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {isAssociated ? (
              <Button
                variant="contained"
                onClick={handleUnlink}
                sx={{
                  bgcolor: "#F02F0A",
                  borderRadius: 10,
                  fontWeight: "bold",
                }}
              >
                ANULAR ASOCIACIÓN
              </Button>
            ) : pendingRequest ? (
              <Chip
                label="INVITACIÓN PENDIENTE"
                sx={{ bgcolor: "#FFCA28", fontWeight: "bold" }}
              />
            ) : (
              <Button
                variant="contained"
                onClick={handleInvite}
                sx={{
                  bgcolor: "#66BB6A",
                  borderRadius: 10,
                  fontWeight: "bold",
                }}
              >
                INVITAR USUARIO
              </Button>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2}>
            {localPets.map((pet) => {
              const isExpanded = expandedPetId === pet.id;

              return (
                <Box
                  key={pet.id}
                  sx={{
                    bgcolor: "#00ADBA",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: 2,
                    }}
                    onClick={() => setExpandedPetId(isExpanded ? null : pet.id)}
                  >
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        id="pet-image"
                        hidden
                        onChange={async (e) => {
                          const urlImage = await handleImagePetUpload(e);
                          if (urlImage) {
                            handlePetChange(pet.id, "imageurl", urlImage);
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
                          {pet.imageurl ? (
                            <img
                              src={pet.imageurl}
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

                      {pet.imageurl && (
                        <Typography
                          onClick={async () => {
                            await handleDeleteImage(pet.imageurl);
                            handlePetChange(pet.id, "imageurl", "");
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
                    {/* <Avatar
                      sx={{
                        bgcolor: "white",
                        color: "#00ADBA",
                        fontWeight: "bold",
                      }}
                    >
                      {pet.name ? pet.name.charAt(0).toUpperCase() : "?"}
                    </Avatar> */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ color: "white", fontWeight: "bold" }}>
                        {pet.name || "Nueva Mascota (Sin nombre)"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        {pet.breed || "Raza no definida"}
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: "white" }}>
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={isExpanded}>
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: "#B2EBF2",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "white",
                          p: 2,
                          borderRadius: 3,
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}
                          >
                            Nombre
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            value={pet.name}
                            onChange={(e) =>
                              handlePetChange(pet.id, "name", e.target.value)
                            }
                            InputProps={{ disableUnderline: true }}
                            sx={{ bgcolor: "#F5F5F5", borderRadius: 2, px: 1 }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 150 }}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}
                          >
                            Raza
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            value={pet.breed}
                            onChange={(e) =>
                              handlePetChange(pet.id, "breed", e.target.value)
                            }
                            InputProps={{ disableUnderline: true }}
                            sx={{ bgcolor: "#F5F5F5", borderRadius: 2, px: 1 }}
                          />
                        </Box>
                        <Box sx={{ width: 170 }}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}
                          >
                            Fecha Nac.
                          </Typography>
                          <TextField
                            fullWidth
                            type="date"
                            size="small"
                            variant="standard"
                            value={pet.birthdate || ""}
                            onChange={(e) =>
                              handlePetChange(
                                pet.id,
                                "birthdate",
                                e.target.value,
                              )
                            }
                            InputProps={{ disableUnderline: true }}
                            sx={{ bgcolor: "#F5F5F5", borderRadius: 2, px: 1 }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ bgcolor: "white", p: 2, borderRadius: 3 }}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold", color: "#00ADBA" }}
                        >
                          Notas del Centro Veterinario
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          variant="standard"
                          placeholder="Observaciones médicas..."
                          value={pet.vetNotes}
                          onChange={(e) =>
                            handlePetChange(pet.id, "vetNotes", e.target.value)
                          }
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            bgcolor: "#F5F5F5",
                            borderRadius: 2,
                            p: 1,
                            mt: 0.5,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          bgcolor: "rgba(255,255,255,0.6)",
                          p: 2,
                          borderRadius: 3,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold" }}
                        >
                          Notas del Propietario (Lectura)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, fontStyle: "italic", color: "#555" }}
                        >
                          {petsExtras[pet.id] || "Sin notas de usuario."}
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Stack>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "#E1F5FE" }}>
        <Button
          onClick={handleExit}
          sx={{ color: "#F02F0A", fontWeight: "bold" }}
        >
          SALIR
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            loadingAction || !!nameError || !!emailError || !!phoneError
          }
          sx={{
            bgcolor: "#FFCA28",
            color: "black",
            borderRadius: 10,
            px: 4,
            fontWeight: "bold",
          }}
        >
          {loadingAction ? <CircularProgress size={24} /> : "GUARDAR CAMBIOS"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDetailsPopup;
