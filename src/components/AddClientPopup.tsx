import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Divider,
  Alert,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { createVetClient } from "../api/query";
import { validateEmail, validatePhone } from "../utils/validationUtils";
import { validateName } from "../utils/validatorName";
import { supabase } from "../api/supabaseClient";
import { createAssociationRequest } from "../api/createAssociationReq";
import { useAuth } from "../context/AuthContext";

// --- Types & Interfaces ---
interface AddClientPopupProps {
  open: boolean;
  onClose: () => void;
  vetCenterId: string;
}

const AddClientPopup = ({
  open,
  onClose,
  vetCenterId,
}: AddClientPopupProps) => {
  // --- State Management ---
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false); // Nuevo estado para email duplicado
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userState } = useAuth();

  // Form inputs state
  const [formData, setFormData] = useState({
    Nombre: "",
    Email: "",
    Telefono: "",
  });

  // Handler for changes in the inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Limpiamos errores al escribir
    if (error) setError(false);
    if (emailExistsError) setEmailExistsError(false);
    if (e.target.name === "Nombre" && errorName) setErrorName(false);
    if (e.target.name === "Email" && errorEmail) setErrorEmail(false);
    if (e.target.name === "Telefono" && errorPhone) setErrorPhone(false);
    if (dbError) setDbError(false);
    if (success) setSuccess(false);
  };

  const grayInputStyle = {
    bgcolor: "white",
    borderRadius: 4,
    px: 2,
    input: {
      color: "black",
      "&::placeholder": { color: "#BDBDBD", opacity: 1 },
    },
  };

  // --- Lógica de Validación ---
  const validateForm = () => {
    const { Nombre, Email, Telefono } = formData;
    setError(false);
    setErrorName(false);
    setErrorEmail(false);
    setErrorPhone(false);
    setEmailExistsError(false);

    if (!Nombre.trim() || !Email.trim() || !Telefono.trim()) {
      setError(true);
      return false;
    }

    const isNameValid = validateName(Nombre);
    const isEmailValid = validateEmail(Email);
    const isPhoneValid = validatePhone(Telefono);

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      if (!isNameValid) setErrorName(true);
      if (!isEmailValid) setErrorEmail(true);
      if (!isPhoneValid) setErrorPhone(true);
      return false;
    }
    return true;
  };

  // --- Handlers ---

  const handleSave = async (sendRequest: boolean = false) => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      // 1. COMPROBAR SI EL EMAIL YA EXISTE EN ESTE CENTRO
      const { data: existingClient } = await supabase
        .from("Client")
        .select("id")
        .eq("email", formData.Email.trim().toLowerCase())
        .eq("veterinarycenterid", vetCenterId)
        .maybeSingle();

      if (existingClient) {
        setEmailExistsError(true);
        setLoading(false);
        return;
      }

      // 2. CREAR CLIENTE
      const newClient = await createVetClient({
        name: formData.Nombre,
        email: formData.Email.trim().toLowerCase(),
        phone: formData.Telefono,
        veterinarycenterid: vetCenterId,
        userid: null,
      });

      // 3. ENVIAR SOLICITUD (Si aplica)
      if (sendRequest && newClient) {
        await createAssociationRequest(
          vetCenterId,
          formData.Email.trim().toLowerCase(),
          userState?.vetCenterEmail || "",
          "professional",
        );

        // Mailto pasivo
        const subject = encodeURIComponent(
          "¡Tu veterinario te invita a Pet Track!",
        );
        const body = encodeURIComponent(
          `Hola ${formData.Nombre},\n\nTu centro veterinario quiere vincular tu ficha con la aplicación Pet Track para que puedas ver el historial de tus mascotas.\n\nRegístrate con este email aquí: [URL_APP]\n\n¡Saludos!`,
        );
        const mailtoUrl = `mailto:${formData.Email}?subject=${subject}&body=${body}`;
        const link = document.createElement("a");
        link.href = mailtoUrl;
        link.click();
        // window.location.href = mailtoUrl;
      }

      setSuccess(true);
      setTimeout(() => {
        handleExit();
        window.location.reload(); // Recargamos para ver el nuevo cliente en la lista
      }, 2000);
    } catch (err) {
      console.error(err);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    setFormData({ Nombre: "", Email: "", Telefono: "" });
    setError(false);
    setErrorName(false);
    setErrorEmail(false);
    setErrorPhone(false);
    setDbError(false);
    setEmailExistsError(false);
    setSuccess(false);
    onClose();
  };

  const isFormModified =
    formData.Nombre.trim() !== "" ||
    formData.Email.trim() !== "" ||
    formData.Telefono.trim() !== "";

  return (
    <Dialog
      open={open}
      onClose={handleExit}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          },
        },
      }}
      PaperProps={{
        sx: { borderRadius: 5, bgcolor: "#E1F5FE", p: 1 },
      }}
    >
      <DialogTitle
        sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.5rem" }}
      >
        Agregar nuevo cliente
      </DialogTitle>

      <DialogContent>
        {/* Errores de Validación */}
        <Collapse in={error}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 5 }}>
            Por favor, rellena todos los campos obligatorios.
          </Alert>
        </Collapse>

        {/* Error Email Duplicado */}
        <Collapse in={emailExistsError}>
          <Alert
            severity="warning"
            sx={{ mb: 2, borderRadius: 5, fontWeight: "bold" }}
          >
            ⚠️ Ya existe un cliente registrado con este correo en tu centro.
          </Alert>
        </Collapse>

        <Collapse in={errorName || errorEmail || errorPhone}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 5 }}>
            Formato incorrecto en:{" "}
            {[
              errorName && "Nombre",
              errorEmail && "Email",
              errorPhone && "Teléfono",
            ]
              .filter(Boolean)
              .join(", ")}
            .
          </Alert>
        </Collapse>

        <Collapse in={dbError}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 5 }}>
            Error al guardar en la base de datos.
          </Alert>
        </Collapse>

        <Collapse in={success}>
          <Alert severity="success" sx={{ mb: 2, borderRadius: 5 }}>
            ¡Cliente registrado correctamente!
          </Alert>
        </Collapse>

        <Stack spacing={2} sx={{ mt: 1 }}>
          {[
            {
              label: "Nombre",
              fieldKey: "Nombre",
              placeholder: "Nombre completo ...",
            },
            {
              label: "Email",
              fieldKey: "Email",
              placeholder: "ejemplo@mail.com ...",
            },
            {
              label: "Teléfono",
              fieldKey: "Telefono",
              placeholder: "600 000 000 ...",
            },
          ].map((field) => (
            <Box
              key={field.label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0.5, sm: 0 },
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: "bold", minWidth: "120px" }}>
                {field.label}
              </Typography>
              <TextField
                size="small"
                variant="standard"
                placeholder={field.placeholder}
                name={field.fieldKey}
                InputProps={{ disableUnderline: true }}
                value={formData[field.fieldKey as keyof typeof formData]}
                onChange={handleChange}
                sx={{ ...grayInputStyle, width: { xs: "100%", sm: 300 } }}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, flexDirection: "column", gap: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: "100%", justifyContent: "flex-end" }}
        >
          <Button
            onClick={handleExit}
            sx={{
              bgcolor: "#F02F0A",
              borderRadius: 10,
              px: 3,
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "#D82E0C" },
            }}
          >
            SALIR
          </Button>

          <Button
            onClick={() => handleSave(false)}
            variant="contained"
            disabled={!isFormModified || loading}
            sx={{
              bgcolor: "#FFCA28",
              borderRadius: 10,
              px: 3,
              color: "black",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "#f9a825" },
            }}
          >
            {loading ? <CircularProgress size={20} /> : "SOLO GUARDAR"}
          </Button>
        </Stack>

        <Button
          onClick={() => handleSave(true)}
          variant="contained"
          fullWidth
          disabled={!formData.Email || loading}
          sx={{
            bgcolor: "#66BB6A",
            borderRadius: 10,
            py: 1.5,
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { bgcolor: "#4CAF50" },
            "&.Mui-disabled": { bgcolor: "#BDBDBD" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "GUARDAR Y ENVIAR SOLICITUD DE ASOCIACIÓN"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientPopup;
