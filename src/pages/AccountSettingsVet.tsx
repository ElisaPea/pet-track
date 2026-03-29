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
import React, { useState } from "react";
import {
  validateEmail,
  validatePhone,
  validateColegiado,
  isNotEmpty,
} from "../utils/validationUtils";

export default function AccountSettingsUser() {
  //Nuevo estado para controlar mensaje de error.
  const [error, setError] = useState<string | null>(null);
  //Nuevo estado para controlar mensaje de error.
  const [error2, setError2] = useState<string | null>(null);
  //Nuevo estado para controlar mensaje guardado con éxito.
  const [success, setSuccess] = useState(false);
  //ArrayList Campos
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "+34 ",
    direccion: "",
    numeroColegiado: "",
  });

  // Manejador de cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Limpiar error mientras escriben
    if (error2) setError2(null); // Limpiar error mientras escriben
    // Ocultamos el éxito si el usuario vuelve a escribir
    if (success) setSuccess(false);
  };

  //Funcion campos obligatorios
  const handleGuardar = () => {
    const { nombre, email, telefono, numeroColegiado } = formData;

    // Reiniciamos estados al principio para evitar que se pisen
    setError(null);
    setError2(null);
    setSuccess(false);

    // Validación de campos VACÍOS
    const faltan: string[] = [];
    if (!isNotEmpty(nombre)) faltan.push("Nombre");
    if (!isNotEmpty(email)) faltan.push("Email");
    if (!isNotEmpty(telefono)) faltan.push("Teléfono");
    if (!isNotEmpty(numeroColegiado)) faltan.push("Nº Colegiado");

    if (faltan.length > 0) {
      setError(`Faltan campos obligatorios: ${faltan.join(", ")}.`);
      return;
    }

    //Validación de FORMATO
    const invalidFields: string[] = [];
    if (!validateEmail(email)) invalidFields.push("Email");
    if (!validatePhone(telefono))
      invalidFields.push("Teléfono (+34 + 9 números)");
    if (!validateColegiado(numeroColegiado))
      invalidFields.push("Nº Colegiado (4-6 números)");

    if (invalidFields.length > 0) {
      setError2(`El formato es incorrecto en: ${invalidFields.join(", ")}.`);
      return;
    }

    //Exito:
    setError(null);
    setError2(null);
    setSuccess(true);
    console.log("Datos guardados con éxito:", formData);

    // Vaciamos el formulario (Reset)
    setFormData({
      nombre: "",
      email: "",
      telefono: "+34 ",
      direccion: "",
      numeroColegiado: "",
    });

    setTimeout(() => setSuccess(false), 3000);
    // Aquí va conexión a Supabase más adelante
  };

  return (
    <BasicScreen>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 8, // Margen superior para centrar visualmente
        }}
      >
        {/* Tipografia actualizar perfil */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", color: "#4A3B3B", mb: 0.5 }}
        >
          Actualiza tu perfil
        </Typography>
        {/* Línea decorativa */}
        <Box sx={{ width: 60, height: 4, bgcolor: "#00BCD4", mb: 4 }} />
        {/* Contenedor Principal (Cuadrado azul claro) */}
        <Box
          sx={{
            bgcolor: "#D1F2F5", // Azul pastel de la imagen
            width: "100%",
            maxWidth: 650,
            borderRadius: 10, // Bordes muy redondeados
            p: 4,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          {/* Formulario */}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {/* Mensaje de Error Visual */}
            <Collapse in={Boolean(error)}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                {error}
              </Alert>
            </Collapse>
            {/* Mensaje de Error Visual  Rellenar correctamente los campos obligatorios*/}
            <Collapse in={Boolean(error2)}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                {error2}
              </Alert>
            </Collapse>
            {/* Mensaje de Error Guardado */}
            <Collapse in={success}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 5 }}>
                ¡Datos guardados correctamente!
              </Alert>
            </Collapse>
            <Stack spacing={3} alignItems="center">
              {/* Campo Nombre*/}
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
                  name="nombre"
                  variant="standard"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={Boolean(error) && !isNotEmpty(formData.nombre)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>
              {/* Campo email */}
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
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
              </Stack>
              {/* Campo telefono */}
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
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={
                    (Boolean(error) && !isNotEmpty(formData.telefono)) ||
                    (Boolean(error2) && !validatePhone(formData.telefono))
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
              {/* Campo Dirección */}
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
                  name="direccion"
                  value={formData.direccion}
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
              {/* Campo Centro vet asociado */}
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
                  name="numeroColegiado"
                  value={formData.numeroColegiado}
                  error={
                    (Boolean(error) && !isNotEmpty(formData.numeroColegiado)) ||
                    (Boolean(error2) &&
                      !validateColegiado(formData.numeroColegiado))
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
              {/* Botón guardar*/}
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
                  onClick={handleGuardar}
                  sx={{
                    bgcolor: "#FBC02D", // Amarillo del botón "Acceder"
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    width: { xs: "100%", sm: "50%" },
                    border: "2px solid #64B5F6", // Borde azul del diseño
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
