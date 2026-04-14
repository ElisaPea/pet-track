import BasicScreen from "../components/BasicScreen";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Collapse,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  validateEmail,
  validatePhone,
  validateColegiado,
  isNotEmpty,
} from "../utils/validationUtils";
import { getVetProfile, supabase, updateVetProfile } from "../api/query";

export default function AccountSettingsVet() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // States for error and success messages
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // 🌟 NUEVO: Estado para guardar la copia original de los datos
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "+34 ",
    address: "",
    licenseNumber: "",
  });

  // Form fields state (What the user modifies)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+34 ",
    address: "",
    licenseNumber: "",
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // ⚠️ DEVELOPMENT HACK: Forcing Bilbo's ID for testing
      // When the app is finished, we will remove this and use supabase.auth.getUser()
      const ID_BILBO = "25a8fd56-fcf7-4629-a419-c5dd9f5891eb";
      
      console.log("1. Forcing search for user:", ID_BILBO);
      setUserId(ID_BILBO);

      try {
        const profile = await getVetProfile(ID_BILBO);
        console.log("2. Data arriving from DB:", profile);

        if (profile) {
          const fetchedData = {
            name: profile.name || "",
            phone: profile.phone || "",
            licenseNumber: profile.licenseNumber || "",
            email: "bilbo@fakeemail.com", // Temporary fake email
            address: "", // Address no viene de la DB en tu configuración actual
          };

          // Guardamos los datos en la vista y en la copia de seguridad oculta
          setFormData(fetchedData);
          setInitialData(fetchedData);
        } else {
          console.error("DB returned null. Check Bilbo's ID.");
        }
      } catch (err) { 
        console.error("Error in query:", err); 
      }
      
      setLoading(false);
    }
    
    loadData();
  }, []);

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error while typing
    if (error2) setError2(null); // Clear error while typing
    if (success) setSuccess(false); // Hide success if user types again
  };

  // 🌟 NUEVO: Variable que calcula en tiempo real si hay cambios
  const isFormModified = 
    formData.name !== initialData.name ||
    formData.email !== initialData.email ||
    formData.phone !== initialData.phone ||
    formData.address !== initialData.address ||
    formData.licenseNumber !== initialData.licenseNumber;

  // Save handler and validations
  const handleSave = async () => {
    // Si no hay cambios, cortamos la ejecución por seguridad
    if (!isFormModified) return;

    const { name, email, phone, licenseNumber } = formData;

    // Reset states
    setError(null);
    setError2(null);
    setSuccess(false);

    // Empty fields validation
    const missingFields: string[] = [];
    if (!isNotEmpty(name)) missingFields.push("Nombre");
    if (!isNotEmpty(email)) missingFields.push("Correo electrónico");
    if (!isNotEmpty(phone)) missingFields.push("Teléfono");
    if (!isNotEmpty(licenseNumber)) missingFields.push("Nº Colegiado");

    if (missingFields.length > 0) {
      setError(`Faltan el campo obligatorio: ${missingFields.join(", ")}.`);
      return;
    }

    // Format validation
    const invalidFields: string[] = [];
    if (!validateEmail(email)) invalidFields.push("Correo electrónico");
    if (!validatePhone(phone)) invalidFields.push("Teléfono");
    if (!validateColegiado(licenseNumber)) invalidFields.push("Nº Colegiado");

    if (invalidFields.length > 0) {
      setError2(`Formato incorrecto en: ${invalidFields.join(", ")}.`);
      return;
    }

    // API Connection
    try {
      if (userId) {
        await updateVetProfile(userId, {
          // We map back to Spanish ONLY for the API call to not break query.ts
          name: formData.name,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber
        });

        setSuccess(true);
        console.log("Data synchronized with Supabase");
        
        // 🌟 NUEVO: Actualizamos nuestra "copia de seguridad" para que el botón vuelva a apagarse
        setInitialData(formData);

        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("No active user session detected.");
      }
    } catch (err) {
      console.error(err);
      setError("Technical error: Could not connect to the database.");
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
          mt: 8,
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

              {/* Email Field */}
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
                  Correo electrónico*:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={
                    (Boolean(error) && !isNotEmpty(formData.email)) ||
                    (Boolean(error2) && !validateEmail(formData.email))
                  }
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
                  Número de teléfono*:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={
                    (Boolean(error) && !isNotEmpty(formData.phone)) ||
                    (Boolean(error2) && !validatePhone(formData.phone))
                  }
                  InputProps={{ disableUnderline: true }}
                  sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 0.5 }}
                />
              </Stack>

              {/* Address Field */}
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
                  Dirección:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
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
                    (Boolean(error2) && !validateColegiado(formData.licenseNumber))
                  }
                  InputProps={{ disableUnderline: true }}
                  sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 0.5 }}
                />
              </Stack>

              {/* Save Button */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  pt: 2,
                }}
              >
                {/* 🌟 NUEVO: Botón condicionalmente estilizado y desactivado */}
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
                    border: isFormModified ? "2px solid #64B5F6" : "2px solid transparent",
                    "&:hover": { 
                      bgcolor: isFormModified ? "#f9a825" : "#e0e0e0" 
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      color: "#9e9e9e",
                    }
                  }}
                >
                  GUARDAR
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </BasicScreen>
  );
}