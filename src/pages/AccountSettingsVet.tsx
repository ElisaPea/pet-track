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
import { getVetProfile, supabase, updateVetProfile} from "../api/query";



export default function AccountSettingsVet() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
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

React.useEffect(() => {
    async function cargarDatos() {
      setLoading(true);
      
      // ⚠️ HACK DE DESARROLLO: Forzamos el ID de Bilbo para probar
      // Cuando la app esté terminada, borraremos esto y usaremos supabase.auth.getUser()
      const ID_BILBO = "25a8fd56-fcf7-4629-a419-c5dd9f5891eb";
      
      console.log("1. Forzando búsqueda para el usuario:", ID_BILBO);
      setUserId(ID_BILBO);

      try {
        const perfil = await getVetProfile(ID_BILBO);
        console.log("2. Datos que llegan de la DB:", perfil);

        if (perfil) {
          setFormData(prev => ({
            ...prev,
            nombre: perfil.nombre || "",
            telefono: perfil.telefono || "",
            numeroColegiado: perfil.numeroColegiado || "",
            email: "bilbo@correofalso.com" // Falso temporalmente
          }));
        } else {
          console.error("La DB ha devuelto null. Revisa el ID de Bilbo.");
        }
      } catch (err) { 
        console.error("Error en la consulta:", err); 
      }
      
      setLoading(false);
    }
    
    cargarDatos();
  }, []);

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

  // Función campos obligatorios y GUARDADO
  const handleGuardar = async () => {
    const { nombre, email, telefono, numeroColegiado } = formData;

    setError(null);
    setError2(null);
    setSuccess(false);

    //Validaciones de VACÍOS
    const faltan: string[] = [];
    if (!isNotEmpty(nombre)) faltan.push("Nombre");
    if (!isNotEmpty(email)) faltan.push("Email");
    if (!isNotEmpty(telefono)) faltan.push("Teléfono");
    if (!isNotEmpty(numeroColegiado)) faltan.push("Nº Colegiado");

    if (faltan.length > 0) {
      setError(`Faltan campos obligatorios: ${faltan.join(", ")}.`);
      return;
    }

    // 2. Validación de FORMATO (Mantenemos tu lógica)
    const invalidFields: string[] = [];
    if (!validateEmail(email)) invalidFields.push("Email");
    if (!validatePhone(telefono)) invalidFields.push("Teléfono");
    if (!validateColegiado(numeroColegiado)) invalidFields.push("Nº Colegiado");

    if (invalidFields.length > 0) {
      setError2(`El formato es incorrecto en: ${invalidFields.join(", ")}.`);
      return;
    }

    //CONEXIÓN REAL A LA API
    try {
      if (userId) {
        await updateVetProfile(userId, {
          nombre: formData.nombre,
          telefono: formData.telefono,
          numeroColegiado: formData.numeroColegiado
          // Nota: Si quieremos guardar la dirección, debemos añadirla a la tabla User en el SQL
        });

        setSuccess(true);
        console.log("Datos sincronizados con Supabase");
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("No se ha detectado una sesión de usuario activa.");
      }
    } catch (err) {
      console.error(err);
      setError("Error técnico: No se pudo conectar con la base de datos.");
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
