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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import centralized validations
import {
  validateEmail,
  validatePhone,
  isNotEmpty,
} from "../utils/validationUtils";

// Import Supabase queries for the regular user
import { getUserProfile, supabase, updateUserProfile } from "../api/query";

export default function AccountSettingsUser() {
  const [vetRequestStatus, setVetRequestStatus] = useState("Ninguno seleccionado");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // States for error and success messages
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //State to store the original copy of the data
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "+34 ",
    address: "",
  });

  // Form fields state in English (what the user modifies)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+34 ",
    address: "",
  });

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      //DEVELOPMENT HACK: Forcing a regular user ID (like Vin) for testing
      // Remember to change this to supabase.auth.getUser() when Auth is ready
      const ID_NORMAL_USER = "25a8fd56-fcf7-4629-a419-c5dd9f5891eb"; 
      
      console.log("1. Forcing search for regular user:", ID_NORMAL_USER);
      setUserId(ID_NORMAL_USER);

      try {
        const profile = await getUserProfile(ID_NORMAL_USER);
        console.log("2. Data arriving from DB:", profile);

        if (profile) {
          const fetchedData = {
            name: profile.name || "",
            phone: profile.phone || "",
            email: "vin@fakeemail.com", // Temporary fake email
            address: "", // Address doesn't come from DB at the moment
          };

          //Save data to the view and the backup copy
          setFormData(fetchedData);
          setInitialData(fetchedData);
        } else {
          console.error("DB returned null. Check the user ID.");
        }
      } catch (err) { 
        console.error("Error in query:", err); 
      }
      
      setLoading(false);
    }
    
    loadData();

    // Check if the browser has a pending request note
    const pendingRequest = localStorage.getItem("pendingVetRequest");
    if (pendingRequest) {
      setVetRequestStatus(`Esperando confirmación de: ${pendingRequest}`);
    }

  }, []);

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error while typing
    if (error2) setError2(null); // Clear error while typing
    if (success) setSuccess(false); // Hide success if user types again
  };

  //Variable that calculates in real-time if there are changes
  const isFormModified = 
    formData.name !== initialData.name ||
    formData.email !== initialData.email ||
    formData.phone !== initialData.phone ||
    formData.address !== initialData.address;

  // Save handler and validations
  const handleSave = async () => {
    // If there are no changes, stop execution for safety
    if (!isFormModified) return;

    const { name, email, phone } = formData;

    // Reset states
    setError(null);
    setError2(null);
    setSuccess(false);

    // Empty fields validation using utils
    const missingFields: string[] = [];
    if (!isNotEmpty(name)) missingFields.push("Nombre");
    if (!isNotEmpty(email)) missingFields.push("Correo electrónico");
    if (!isNotEmpty(phone)) missingFields.push("Número de teléfono");

    if (missingFields.length > 0) {
      setError(`Campos requeridos faltantes: ${missingFields.join(", ")}.`);
      return;
    }

    // Format validation using utils
    const invalidFields: string[] = [];
    if (!validateEmail(email)) invalidFields.push("Correo electrónico");
    if (!validatePhone(phone)) invalidFields.push("Número de teléfono");

    if (invalidFields.length > 0) {
      setError2(`Formato incorrecto en: ${invalidFields.join(", ")}.`);
      return;
    }

    // API Connection
    try {
      if (userId) {
        await updateUserProfile(userId, {
          name: formData.name,
          phone: formData.phone,
          // Address is not saved in DB for now according to SQL
        });

        setSuccess(true);
        console.log("Data synchronized with Supabase");
        
        //Update our "backup copy" so the button turns off again
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
        {/* Back Button */}
          <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <IconButton
            onClick={() => navigate(SCREEN.WELCOME_USER)}
            sx={{
              bgcolor: "#FBC02D",
              color: "black",
              "&:hover": { bgcolor: "#f9a825" },
              boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
            }}
          >
          <ArrowBackIcon fontSize="medium" />
          </IconButton>
        </Box>



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
                  Nombre*:
                </Typography>
                <TextField
                  fullWidth
                  id="name-input"
                  name="name"
                  variant="standard"
                  value={formData.name}
                  onChange={handleChange}
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

              {/* Email Field */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography
                  component="label" 
                  htmlFor="email-input"
                  sx={{
                    width: 400,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                  }}
                >
                  Correo electrónico*:
                </Typography>
                <TextField
                  id="email-input"
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
                  Número de teléfono*:
                </Typography>
                <TextField
                  id="phone-input"
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
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
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
                  value={vetRequestStatus}
                  InputProps={{ disableUnderline: true, readOnly: true }}
                  sx={{
                    bgcolor: "#bebebeff", // Slightly gray to denote it's not editable here
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
                    navigate(SCREEN.listVet);
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
                
                {/*Conditionally styled and disabled button */}
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