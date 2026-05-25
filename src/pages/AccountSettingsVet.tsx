import BasicScreen from "../components/BasicScreen";
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
import React, { useState } from "react";
import {
  validateEmail,
  validatePhone,
  validateColegiado,
  isNotEmpty,
} from "../utils/validationUtils";
import { updateVetProfile } from "../api/query";
import { logout, updateUserSettingsEmail } from "../api/signInQuery";
import { SCREEN } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AccountSettingsVet() {
  const navigate = useNavigate();

  // States for email specific authentication
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // States for error and success messages
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { userState, updateAuth } = useAuth();

  // Form fields state (Current values the user is modifying)
  const [formData, setFormData] = useState(userState);

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error while typing
    if (error2) setError2(null); // Clear format error while typing
    if (success) setSuccess(false); // Hide success message if user types again
  };

  //Logical variable that calculates in real-time if changes exist
  const isFormModified =
    formData.name !== userState.name ||
    formData.phone !== userState.phone ||
    formData.address !== userState.address ||
    formData.licenseNumber !== userState.licenseNumber;

  // Save handler and validations
  const handleSave = async () => {
    // If no changes were made, stop execution for safety
    if (!isFormModified) return;

    const { name, phone, licenseNumber } = formData;

    // Reset alert states
    setError(null);
    setError2(null);
    setSuccess(false);

    // Empty fields validation
    const missingFields: string[] = [];
    if (!isNotEmpty(name)) missingFields.push("Nombre");
    if (!isNotEmpty(licenseNumber)) missingFields.push("Nº Colegiado");

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}.`);
      return;
    }

    // Format validation
    const invalidFields: string[] = [];
    if (phone && phone.length && !validatePhone(phone))
      invalidFields.push("Teléfono");
    if (!validateColegiado(licenseNumber)) invalidFields.push("Nº Colegiado");

    if (invalidFields.length > 0) {
      setError2(`Incorrect format in: ${invalidFields.join(", ")}.`);
      return;
    }

    // API Connection
    try {
      if (userState.id) {
        await updateVetProfile(userState?.id, formData);

        await updateAuth();

        setSuccess(true);
        console.log("Data synchronized with Supabase");

        // setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("No active user session detected.");
      }
    } catch (err) {
      console.error(err);
      setError("Technical error: Could not connect to the database.");
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
      await updateUserSettingsEmail(formData.email);

      // 3. Si todo va bien, avisamos al usuario
      setEmailSuccess(true);
      console.log("Email actualizado correctamente");

      // 4. Mini delay para que lea el mensaje y logout
      setTimeout(async () => {
        await logout(navigate);
      }, 3000);
    } catch (err: any) {
      // 5. Si falla, mostramos el error
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
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", color: "#4A3B3B", mb: 0.5 }}
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
            onClick={() => navigate(SCREEN.HOME_VET)}
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
                spacing={{ xs: 1, sm: 0 }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Nombre*:
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  variant="standard"
                  value={formData.name}
                  onChange={handleChange}
                  error={Boolean(error) && !isNotEmpty(formData.name)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 0.5 }}
                />
              </Stack>

              {/* Phone Field */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Número de teléfono:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={Boolean(error2) && !validatePhone(formData.phone)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 0.5 }}
                />
              </Stack>


              {/* License Number Field */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Nº Colegiado*:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  error={
                    (Boolean(error) && !isNotEmpty(formData.licenseNumber)) ||
                    (Boolean(error2) &&
                      !validateColegiado(formData.licenseNumber))
                  }
                  InputProps={{ disableUnderline: true }}
                  sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 0.5 }}
                />
              </Stack>

              {/* Save Button Container */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  pt: 2,
                }}
              >
                <Button
                  variant="contained"
                  disabled={!isFormModified}
                  onClick={handleSave}
                  sx={{
                    bgcolor: isFormModified ? "#FBC02D" : "#e0e0e0",
                    color: isFormModified ? "black" : "#9e9e9e",
                    fontWeight: "bold",
                    borderRadius: 2,
                    width: { xs: "100%", sm: "50%" },
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
