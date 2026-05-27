import BasicScreen from "../components/BasicScreen";
import { useAssociation } from "../context/AssociationContext";
import { Chip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Collapse,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import centralized validations
import {
  validateEmail,
  validatePhone,
  isNotEmpty,
} from "../utils/validationUtils";

// Import Supabase queries for the regular user
import { updateUserProfile } from "../api/query";
import { useAuth } from "../context/AuthContext";
import { logout, updateUserSettingsEmail } from "../api/signInQuery";

export default function AccountSettingsUser() {

  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const { associatedVets } = useAssociation();

  // States for error and success messages
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { userState } = useAuth();

  // Form fields state in English (what the user modifies)
  const [formData, setFormData] = useState({
    name: userState?.name,
    email: userState?.email,
    phone: userState?.phone,
    address: userState?.address,
  });


  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error while typing
    if (error2) setError2(null); // Clear error while typing
    if (success) setSuccess(false); // Hide success if user types again
  };

  const handleChangeName = (value: string) => {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value)) {
      setError("El nombre solo puede contener letras.");
    } else {
      // Clear error if valid again
      if (error === "El nombre solo puede contener letras.") {
        setError(null);
      }

      setFormData((prev) => ({
        ...prev,
        name: value,
      }));
    }

    if (success) setSuccess(false);
  };

  const handleChangePhone = (value: string) => {
    // Prevent letters or special characters
    if (/[^\d]/.test(value)) {
      setError2("El teléfono solo puede contener números.");
      return;
    }

    // Clear error if valid again
    if (error2 === "El teléfono solo puede contener números.") {
      setError2(null);
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    if (success) setSuccess(false);
  };

  //Variable that calculates in real-time if there are changes
  const isFormModified =
    formData.name !== userState?.name ||
    formData.phone !== userState?.phone ||
    formData.address !== userState?.address;

  // Save handler and validations
  const handleSave = async () => {
    // If there are no changes, stop execution for safety
    if (!isFormModified) return;

    const { name, phone } = formData;

    // Reset states
    setError(null);
    setError2(null);
    setSuccess(false);

    // Empty fields validation using utils
    const missingFields: string[] = [];
    if (!isNotEmpty(name)) missingFields.push("Nombre");

    if (missingFields.length > 0) {
      setError(`Campos requeridos faltantes: ${missingFields.join(", ")}.`);
      return;
    }

    // Format validation using utils
    const invalidFields: string[] = [];
    if (!validatePhone(phone)) invalidFields.push("Número de teléfono");

    if (invalidFields.length > 0) {
      setError2(`Formato incorrecto en: ${invalidFields.join(", ")}.`);
      return;
    }

    // API Connection
    try {
      await updateUserProfile(userState?.id, {
        name: formData.name,
        phone: formData.phone,
        // Address is not saved in DB for now according to SQL
      });

      setSuccess(true);
      console.log("Data synchronized with Supabase");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Error técnico: No se pudo conectar con la base de datos.");
    }
  };

  // Handler para el cambio de email (Accordion)
  const handleConfirmEmailChange = async () => {
    setEmailError(null);
    setEmailSuccess(false);

    // 1. Validaciones previas
    if (!validateEmail(formData.email)) {
      setEmailError("Por favor, introduce un correo electrónico válido.");
      return;
    }

    if (formData.email === userState?.email) {
      setEmailError("El nuevo correo debe ser diferente al actual.");
      return;
    }

    try {
      // 2. Intentar actualizar en Supabase
      await updateUserSettingsEmail(
        formData.email,
        userState?.email || "",
        userState?.id || "",
      );

      // 3. Si todo va bien, avisamos al usuario
      setEmailSuccess(true);
      console.log("Email actualizado correctamente");

      // 4. Mini delay para que lea el mensaje y logout
      setTimeout(async () => {
        await logout(navigate);
      }, 3000);
    } catch (err: any) {
      // 5. Si falla (email duplicado, etc.), mostramos el error
      console.error(err);
      setEmailError(err.message || "No se pudo actualizar el correo.");
    }
  };

  return (
    <BasicScreen>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", color: "#4A3B3B" }}
        >
          Actualiza tu perfil
        </Typography>

        <Box sx={{ width: 60, height: 4, bgcolor: "#00BCD4", mb: 4 }} />

        <Box
          sx={{
            bgcolor: "#D1F2F5",
            width: "100%",
            maxWidth: 650,
            borderRadius: 10,
            p: 4,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 650,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 6
            }}
          >
            <IconButton
              onClick={() => navigate(SCREEN.WELCOME_USER)}
              sx={{
                position: "absolute",
                left: 0,
                bgcolor: "#FBC02D",
                color: "black",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "#f9a825" },
              }}
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>
          </Box>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Collapse in={Boolean(error)}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                {error}
              </Alert>
            </Collapse>

            <Collapse in={Boolean(error2)}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                {error2}
              </Alert>
            </Collapse>

            <Collapse in={success}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 5 }}>
                ¡Datos guardados exitosamente!
              </Alert>
            </Collapse>

            <Stack spacing={3} alignItems="center">
              {/* Name Field */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  component="label"
                  htmlFor="name-input"
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Nombre: *
                </Typography>
                <TextField
                  fullWidth
                  id="name-input"
                  name="name"
                  variant="standard"
                  value={formData.name}
                  onChange={(e) => handleChangeName(e.target.value)}
                  error={Boolean(error) && !isNotEmpty(formData.name)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>

              {/* Phone Field */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  component="label"
                  htmlFor="phone-input"
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Número de teléfono:
                </Typography>
                <TextField
                  id="phone-input"
                  fullWidth
                  variant="standard"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChangePhone(e.target.value)}
                  error={Boolean(error2) && !validatePhone(formData.phone)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>

              {/* Associated Vet Center Field */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  component="label"
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Centro Veterinario Asociado:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  value=""
                  InputProps={{
                    disableUnderline: true,
                    readOnly: true,
                    inputComponent: () => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                          overflowX: "auto",
                          gap: 1,
                          alignItems: "center",
                          width: "100%",
                          "&::-webkit-scrollbar": { height: 4 },
                          "&::-webkit-scrollbar-thumb": { bgcolor: "#00ADBA", borderRadius: 2 },
                        }}
                      >
                        {associatedVets.length > 0 ? (
                          associatedVets.map((vet, index) => (
                            <Chip
                              key={vet.id}
                              label={vet.name}
                              size="small"
                              icon={<BusinessIcon style={{ fontSize: "0.9rem" }} />}
                              sx={{
                                flexShrink: 0,
                                bgcolor: ["#FFD1DC", "#B3E5BE", "#FFECB3", "#C5CAE9", "#F8BBD0"][index % 5],
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Ninguno seleccionado
                          </Typography>
                        )}
                      </Box>
                    ),
                  }}
                  sx={{
                    bgcolor: associatedVets.length > 0 ? "white" : "#bebebeff",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>

              {/* Action Buttons */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  gap: 4,
                  alignItems: "center",
                  pt: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(SCREEN.LIST_VET);
                  }}
                  sx={{
                    bgcolor: "#FBC02D",
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    width: "100%",
                    border: "2px solid #64B5F6",
                    "&:hover": { bgcolor: "#f9a825" },
                  }}
                >
                  BUSCAR CENTRO VETERINARIO
                </Button>

                <Button
                  variant="contained"
                  disabled={!isFormModified}
                  onClick={handleSave}
                  sx={{
                    bgcolor: isFormModified ? "#FBC02D" : "#e0e0e0",
                    color: isFormModified ? "black" : "#9e9e9e",
                    fontWeight: "bold",
                    borderRadius: 2,
                    width: "100%",
                    border: isFormModified
                      ? "2px solid #64B5F6"
                      : "2px solid transparent",
                    "&:hover": {
                      bgcolor: isFormModified ? "#f9a825" : "#e0e0e0",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  GUARDAR
                </Button>
              </Box>

              {/* Accordion for Authentication Data */}
              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  width: "100%",
                  borderRadius: "20px !important",
                  boxShadow: "none",
                  bgcolor: "rgba(255,255,255,0.5)",
                  mt: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "bold", color: "#4A3B3B" }}>
                    Datos de autenticación
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Mensajes de feedback específicos para el email */}
                  <Collapse in={Boolean(emailError)}>
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 5 }}>
                      {emailError}
                    </Alert>
                  </Collapse>
                  <Collapse in={emailSuccess}>
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 5 }}>
                      ¡Correo actualizado! Cerrando sesión para reiniciar...
                    </Alert>
                  </Collapse>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "#666", textAlign: "left" }}
                  >
                    Al cambiar tu correo,{" "}
                    <b>tu sesión se cerrará automáticamente</b>. Deberás volver
                    a entrar con tu nueva dirección (la contraseña no cambia).
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      variant="standard"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nuevo correo electrónico"
                      error={Boolean(emailError)}
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 50,
                        px: 2,
                        py: 0.5,
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleConfirmEmailChange}
                      disabled={emailSuccess}
                      sx={{
                        bgcolor: "#FBC02D",
                        color: "black",
                        fontWeight: "bold",
                        borderRadius: 50,
                        px: 3,
                        whiteSpace: "nowrap",
                        border: "2px solid #64B5F6",
                        "&:hover": { bgcolor: "#f9a825" },
                        "&.Mui-disabled": { bgcolor: "#e0e0e0" },
                      }}
                    >
                      CONFIRMAR
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Box>
        </Box>
      </Box>
    </BasicScreen>
  );
}