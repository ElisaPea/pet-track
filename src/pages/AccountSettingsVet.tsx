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

// Import centralized validations
import {
  validateEmail,
  validatePhone,
  validateColegiado,
  isNotEmpty,
} from "../utils/validationUtils";

// Import Supabase queries for the vet profile
import { getVetProfile, supabase, updateVetProfile } from "../api/query";

export default function AccountSettingsVet() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // States for error and success messages
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // State to control which fields are currently in edit mode
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    licenseNumber: false,
  });
  
  // Form fields state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+34 ",
    address: "",
    licenseNumber: "",
  });

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // DEVELOPMENT HACK: Forcing Bilbo's ID for testing
      // Remember to change this to supabase.auth.getUser() when Auth is ready
      const ID_BILBO = "25a8fd56-fcf7-4629-a419-c5dd9f5891eb";
      
      console.log("1. Forcing search for user:", ID_BILBO);
      setUserId(ID_BILBO);

      try {
        const profile = await getVetProfile(ID_BILBO);
        console.log("2. Data arriving from DB:", profile);

        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || "",
            phone: profile.phone || "",
            licenseNumber: profile.licenseNumber || "",
            email: "bilbo@fakeemail.com" // Temporary mock email
          }));
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
    if (error) setError(null); // Clear empty field error while typing
    if (error2) setError2(null); // Clear format error while typing
    if (success) setSuccess(false); // Hide success message if user types again
  };

  // Toggles the edit mode of a specific field
  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Save handler and validations
  const handleSave = async () => {
    const { name, email, phone, licenseNumber } = formData;

    // Reset alert states
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
      setError(`Falta el campo obligatorio: ${missingFields.join(", ")}.`);
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
          name: formData.name,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber
        });

        setSuccess(true);
        console.log("Data synchronized with Supabase");
        
        // Lock all fields again after a successful save
        setIsEditing({ name: false, email: false, phone: false, address: false, licenseNumber: false });

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
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" sx={{ width: "100%" }}>
                <Typography component="label" htmlFor="name-input" sx={{ width: 400, textAlign: { xs: "center", sm: "left" }, fontWeight: "bold" }}>
                  Nombre*:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    id="name-input"
                    name="name"
                    variant="standard"
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(error) && !isNotEmpty(formData.name)}
                    InputProps={{ disableUnderline: true, readOnly: !isEditing.name }}
                    sx={{ bgcolor: isEditing.name ? "white" : "#e0e0e0", borderRadius: 50, px: 2, py: 0.5 }}
                  />
                  <Button 
                    onClick={() => toggleEdit("name")} 
                    sx={{ color: "#F9A825", fontWeight: "bold", minWidth: "80px" }}
                  >
                    EDITAR
                  </Button>
                </Stack>
              </Stack>

              {/* Email Field */}
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" sx={{ width: "100%" }}>
                <Typography component="label" htmlFor="email-input" sx={{ width: 400, textAlign: { xs: "center", sm: "left" }, fontWeight: "bold" }}>
                  Correo electrónico*:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <TextField
                    id="email-input"
                    fullWidth
                    variant="standard"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={(Boolean(error) && !isNotEmpty(formData.email)) || (Boolean(error2) && !validateEmail(formData.email))}
                    InputProps={{ disableUnderline: true, readOnly: !isEditing.email }}
                    sx={{ bgcolor: isEditing.email ? "white" : "#e0e0e0", borderRadius: 50, px: 2, py: 0.5 }}
                  />
                  <Button 
                    onClick={() => toggleEdit("email")} 
                    sx={{ color: "#F9A825", fontWeight: "bold", minWidth: "80px" }}
                  >
                    EDITAR
                  </Button>
                </Stack>
              </Stack>

              {/* Phone Field */}
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" sx={{ width: "100%" }}>
                <Typography component="label" htmlFor="phone-input" sx={{ width: 400, textAlign: { xs: "center", sm: "left" }, fontWeight: "bold" }}>
                  Número de teléfono*:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <TextField
                    id="phone-input"
                    fullWidth
                    variant="standard"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={(Boolean(error) && !isNotEmpty(formData.phone)) || (Boolean(error2) && !validatePhone(formData.phone))}
                    InputProps={{ disableUnderline: true, readOnly: !isEditing.phone }}
                    sx={{ bgcolor: isEditing.phone ? "white" : "#e0e0e0", borderRadius: 50, px: 2, py: 0.5 }}
                  />
                  <Button 
                    onClick={() => toggleEdit("phone")} 
                    sx={{ color: "#F9A825", fontWeight: "bold", minWidth: "80px" }}
                  >
                    EDITAR
                  </Button>
                </Stack>
              </Stack>

              {/* Address Field */}
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" sx={{ width: "100%" }}>
                <Typography sx={{ width: 400, textAlign: { xs: "center", sm: "left" }, fontWeight: "bold" }}>
                  Dirección:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="address" 
                    value={formData.address}
                    onChange={handleChange}
                    InputProps={{ disableUnderline: true, readOnly: !isEditing.address }}
                    sx={{ bgcolor: isEditing.address ? "white" : "#e0e0e0", borderRadius: 50, px: 2, py: 0.5 }}
                  />
                  <Button 
                    onClick={() => toggleEdit("address")} 
                    sx={{ color: "#F9A825", fontWeight: "bold", minWidth: "80px" }}
                  >
                    EDITAR
                  </Button>
                </Stack>
              </Stack>

              {/* License Number Field */}
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" sx={{ width: "100%" }}>
                <Typography sx={{ width: 400, textAlign: { xs: "center", sm: "left" }, fontWeight: "bold" }}>
                  Nº Colegiado*:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    error={(Boolean(error) && !isNotEmpty(formData.licenseNumber)) || (Boolean(error2) && !validateColegiado(formData.licenseNumber))}
                    InputProps={{ disableUnderline: true, readOnly: !isEditing.licenseNumber }}
                    sx={{ bgcolor: isEditing.licenseNumber ? "white" : "#e0e0e0", borderRadius: 50, px: 2, py: 0.5 }}
                  />
                  <Button 
                    onClick={() => toggleEdit("licenseNumber")} 
                    sx={{ color: "#F9A825", fontWeight: "bold", minWidth: "80px" }}
                  >
                    EDITAR
                  </Button>
                </Stack>
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
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    bgcolor: "#FBC02D",
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    width: { xs: "100%", sm: "50%" },
                    border: "2px solid #64B5F6",
                    "&:hover": { bgcolor: "#f9a825" },
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