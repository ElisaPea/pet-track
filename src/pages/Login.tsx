import BasicScreen from "../components/BasicScreen";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  RadioGroup,
  Select,
  Radio,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Alert,
} from "@mui/material";
import FootprintIcon from "../components/FootprintIcon";
import { useEffect, useState } from "react";
import { getVetCenters, createVetCenter } from "../api/query"; // Importamos la nueva query
import { signIn, signUpComplete } from "../api/signInQuery";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Visibility, VisibilityOff, AddCircle } from "@mui/icons-material";

const navigateConfig = {
  user: SCREEN.WELCOME_USER,
  professional: SCREEN.HOME_VET,
};

const config = {
  login: {
    title: "Accede a tu cuenta!",
    mainButton: "ACCEDER",
    secondaryButton: "CREAR CUENTA",
  },
  register: {
    title: "Crea tu cuenta!",
    mainButton: "CREAR CUENTA",
    secondaryButton: "ACCEDER",
  },
};

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  password: "",
  typeUser: "user" as "user" | "professional",
  selectedVet: "",
  licenseNumber: "",
};

export default function Login() {
  const [mode, setMode] = useState<keyof typeof config>("login");
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [vetCenters, setVetCenters] = useState<any[]>([]);
  const [viewPassword, setViewPassword] = useState(false);
  const { updateAuth } = useAuth();
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  // Estados para el Dialog de Nuevo Centro
  const [openDialog, setOpenDialog] = useState(false);
  const [newCenter, setNewCenter] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const isLogin = mode === "login";
  const isProfessional = form.typeUser === "professional";

  const loadVetCenters = async () => {
    const data = await getVetCenters();
    setVetCenters(data || []);
  };

  useEffect(() => {
    loadVetCenters();
  }, []);

  const handleOpenDialog = () => {
    setNewCenter({
      name: "",
      email: form.email, // Por defecto el correo que ya escribió el usuario
      address: "",
      phone: "",
    });
    setOpenDialog(true);
  };

  const handleCreateCenter = async () => {
    setErrorDialog(null);

    // 1. Validaciones de campos vacíos
    if (!newCenter.name.trim() || !newCenter.email.trim()) {
      setErrorDialog("El nombre y el correo son obligatorios.");
      return;
    }

    // 2. Validación de formato de email
    if (!testEmail(newCenter.email)) {
      setErrorDialog("El formato del correo electrónico no es válido.");
      return;
    }

    try {
      const createdCenter = await createVetCenter(newCenter);
      await loadVetCenters(); // Recargar lista de la DB

      // Opcional: Seleccionar automáticamente el centro recién creado
      setForm((prev) => ({ ...prev, selectedVet: createdCenter.id }));

      setOpenDialog(false);
    } catch (error: any) {
      console.error(error);
      setErrorDialog(
        "Error al conectar con la base de datos o correo ya existente.",
      );
    }
  };

  const handleModeChange = () => {
    setMode(isLogin ? "register" : "login");
    setErrors({});
    setForm(initialFormState);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChangeTypeUser = (value: string) => {
    setForm({
      ...initialFormState,
      email: form.email,
      password: form.password,
      typeUser: value as "user" | "professional",
    });
    if (Object.keys(errors).length > 0) setErrors({});
  };

  const testEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleAccept = async () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = "El correo es obligatorio.";
    if (form.email && !testEmail(form.email))
      newErrors.email = "El correo no es válido.";
    if (!form.password) newErrors.password = "El password es obligatorio.";
    if (!form.name && !isLogin) newErrors.name = "El nombre es obligatorio.";
    if (!isLogin && isProfessional) {
      if (!form.licenseNumber)
        newErrors.licenseNumber = "El Nº Colegiado es obligatorio.";
      if (!form.selectedVet)
        newErrors.selectedVet = "El Centro Vet es obligatorio.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isLogin) {
        const authData = await signIn(form.email, form.password);
        await updateAuth(authData.session);

        const { data: userData, error: roleError } = await supabase
          .from("User")
          .select("role")
          .eq("id", authData.user?.id)
          .single();

        if (roleError) {
          throw new Error("No se pudo recuperar el rol del usuario.");
        }

        const userRole = userData?.role as keyof typeof navigateConfig;

        if (userRole in navigateConfig) {
          navigate(navigateConfig[userRole]);
        }
      } else {
        const authData = await signUpComplete({
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone,
          role: form.typeUser,
          licenseNumber: form.licenseNumber,
          veterinaryCenterId: form.selectedVet,
        });

        if (authData?.session) {
          await updateAuth(authData.session);
          const targetRole = form.typeUser as keyof typeof navigateConfig;
          if (targetRole in navigateConfig) {
            navigate(navigateConfig[targetRole]);
          }
        } else {
          throw new Error("No se pudo iniciar sesión tras el registro.");
        }
      }
    } catch (error: any) {
      if (
        error.message.includes("User already registered") ||
        error.code === "23505"
      ) {
        setErrors({
          email: "Este correo ya está registrado. Intenta iniciar sesión.",
        });
      } else if (error.message.includes("Invalid login credentials")) {
        setErrors({ email: "Credenciales incorrectas.", password: " " });
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const handleChangeEmail = (value: string) => {
    if (value && !testEmail(value)) {
      setForm((prev) => ({ ...prev, email: value }));
      setErrors((prev) => ({ ...prev, email: "El correo no es válido." }));
    } else handleChange("email", value);
  };

  return (
    <BasicScreen>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 8,
          px: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#D1F2F5",
            width: "100%",
            maxWidth: 550,
            borderRadius: 10,
            p: { xs: 3, sm: 4 },
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          {/* Titulo */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4, flexWrap: "wrap" }}
          >
            <FootprintIcon />
            <Typography variant="h4" sx={{ fontWeight: "500", color: "#333" }}>
              {config[mode].title}
            </Typography>
          </Stack>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={{ xs: 3, sm: 3.5 }} alignItems="center">
              {/* Correo */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={{ xs: 1, sm: 0 }}
                sx={{ width: "100%", position: "relative" }}
              >
                <Typography
                  sx={{
                    width: { xs: "100%", sm: 180 },
                    textAlign: "left",
                    fontWeight: "bold",
                    mb: { xs: 0.5, sm: 0 },
                  }}
                >
                  Correo: *
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  value={form.email}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
                {errors.email && (
                  <Typography
                    sx={{
                      color: "red",
                      position: "absolute",
                      left: { xs: 0, sm: "50%" },
                      top: "100%",
                      fontSize: "0.8rem",
                    }}
                  >
                    {errors.email}
                  </Typography>
                )}
              </Stack>

              {/* Password */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={{ xs: 1, sm: 0 }}
                sx={{ width: "100%", position: "relative" }}
              >
                <Typography
                  sx={{
                    width: { xs: "100%", sm: 180 },
                    textAlign: "left",
                    fontWeight: "bold",
                    mb: { xs: 0.5, sm: 0 },
                  }}
                >
                  Password: *
                </Typography>

                <TextField
                  fullWidth
                  type={viewPassword ? "text" : "password"}
                  variant="standard"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.5,
                  }}
                />
                <IconButton
                  onClick={() => setViewPassword(!viewPassword)}
                  edge="end"
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                >
                  {viewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                {errors.password && (
                  <Typography
                    sx={{
                      color: "red",
                      position: "absolute",
                      left: { xs: 0, sm: "50%" },
                      top: "100%",
                      fontSize: "0.8rem",
                    }}
                  >
                    {errors.password}
                  </Typography>
                )}
              </Stack>

              {/* Registro Fields */}
              {!isLogin && (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Typography
                      sx={{
                        width: { xs: "100%", sm: 180 },
                        textAlign: "left",
                        fontWeight: "bold",
                        mb: { xs: 0.5, sm: 0 },
                      }}
                    >
                      Nombre: *
                    </Typography>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 50,
                        px: 2,
                        py: 0.5,
                      }}
                    />
                    {errors.name && (
                      <Typography
                        sx={{
                          color: "red",
                          position: "absolute",
                          left: { xs: 0, sm: "50%" },
                          top: "100%",
                          fontSize: "0.8rem",
                        }}
                      >
                        {errors.name}
                      </Typography>
                    )}
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Typography
                      sx={{
                        width: { xs: "100%", sm: 180 },
                        textAlign: "left",
                        fontWeight: "bold",
                        mb: { xs: 0.5, sm: 0 },
                      }}
                    >
                      Teléfono:
                    </Typography>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 50,
                        px: 2,
                        py: 0.5,
                      }}
                    />
                  </Stack>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 0.5, sm: 0 }}
                    sx={{ width: "100%" }}
                  >
                    <Typography
                      sx={{
                        width: { xs: "100%", sm: 180 },
                        fontWeight: "bold",
                      }}
                    >
                      Tipo de usuario:
                    </Typography>
                    <RadioGroup
                      row={!isLogin && !isProfessional}
                      value={form.typeUser}
                      onChange={(e) => handleChangeTypeUser(e.target.value)}
                    >
                      <FormControlLabel
                        value="user"
                        control={<Radio />}
                        label="Usuario"
                      />
                      <FormControlLabel
                        value="professional"
                        control={<Radio />}
                        label="Profesional"
                      />
                    </RadioGroup>
                  </Stack>
                </>
              )}

              {/* Campos profesionales */}
              {!isLogin && isProfessional && (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Typography
                      sx={{
                        width: { xs: "100%", sm: 180 },
                        fontWeight: "bold",
                        mb: { xs: 0.5, sm: 0 },
                      }}
                    >
                      Nº Colegiado: *
                    </Typography>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={form.licenseNumber}
                      onChange={(e) =>
                        handleChange("licenseNumber", e.target.value)
                      }
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 50,
                        px: 2,
                        py: 0.5,
                      }}
                    />
                    {errors.licenseNumber && (
                      <Typography
                        sx={{
                          color: "red",
                          position: "absolute",
                          left: { xs: 0, sm: "50%" },
                          top: "100%",
                          fontSize: "0.8rem",
                        }}
                      >
                        {errors.licenseNumber}
                      </Typography>
                    )}
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1, sm: 0 }}
                    sx={{ width: "100%", position: "relative" }}
                  >
                    <Typography
                      sx={{
                        width: { xs: "100%", sm: 180 },
                        fontWeight: "bold",
                        mb: { xs: 0.5, sm: 0 },
                      }}
                    >
                      Centro Vet: *
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Select
                        value={form.selectedVet}
                        onChange={(e) =>
                          handleChange("selectedVet", e.target.value)
                        }
                        displayEmpty
                        fullWidth
                        sx={{
                          bgcolor: "white",
                          borderRadius: 50,
                          px: 2,
                          py: 0.5,
                          "& .MuiSelect-select": { padding: "6px 8px" },
                        }}
                      >
                        {vetCenters.map((center) => (
                          <MenuItem key={center.id} value={center.id}>
                            {center.name} - {center.email}
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton
                        onClick={handleOpenDialog}
                        sx={{ color: "#00BCD4" }}
                      >
                        <AddCircle fontSize="large" />
                      </IconButton>
                    </Box>
                    {errors.selectedVet && (
                      <Typography
                        sx={{
                          color: "red",
                          position: "absolute",
                          left: { xs: 0, sm: "50%" },
                          top: "100%",
                          fontSize: "0.8rem",
                        }}
                      >
                        {errors.selectedVet}
                      </Typography>
                    )}
                  </Stack>
                </>
              )}

              {/* Botones */}
              <Box sx={{ width: "100%", pt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#FBC02D",
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    mb: 2,
                    border: "2px solid #64B5F6",
                    "&:hover": { bgcolor: "#f9a825" },
                  }}
                  onClick={handleAccept}
                >
                  {config[mode].mainButton}
                </Button>

                <Button
                  onClick={handleModeChange}
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#9EABB3",
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#78909C" },
                  }}
                >
                  {config[mode].secondaryButton}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Dialog para crear Centro Veterinario */}
      {/* Dialog para crear Centro Veterinario */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setErrorDialog(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 10,
            bgcolor: "#D1F2F5",
            p: { xs: 2, sm: 4 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "600",
            textAlign: "center",
            color: "#4A3B3B",
            fontSize: "1.5rem",
          }}
        >
          Nuevo Centro Veterinario
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Alerta de error: Ahora captura las validaciones y errores de red */}
            <Collapse in={Boolean(errorDialog)}>
              <Alert
                severity="error"
                sx={{ borderRadius: 5, mb: 1, fontWeight: "500" }}
              >
                {errorDialog}
              </Alert>
            </Collapse>

            <TextField
              placeholder="Nombre del centro *"
              fullWidth
              variant="standard"
              value={newCenter.name}
              onChange={(e) => {
                setNewCenter({ ...newCenter, name: e.target.value });
                if (errorDialog) setErrorDialog(null);
              }}
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 1 }}
            />
            <TextField
              placeholder="Correo electrónico del centro *"
              fullWidth
              variant="standard"
              value={newCenter.email}
              onChange={(e) => {
                setNewCenter({ ...newCenter, email: e.target.value });
                if (errorDialog) setErrorDialog(null);
              }}
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 1 }}
            />
            <TextField
              placeholder="Dirección"
              fullWidth
              variant="standard"
              value={newCenter.address}
              onChange={(e) =>
                setNewCenter({ ...newCenter, address: e.target.value })
              }
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 1 }}
            />
            <TextField
              placeholder="Teléfono"
              fullWidth
              variant="standard"
              value={newCenter.phone}
              onChange={(e) =>
                setNewCenter({ ...newCenter, phone: e.target.value })
              }
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: "white", borderRadius: 50, px: 2, py: 1 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3, px: 3 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setErrorDialog(null);
            }}
            sx={{
              color: "#4A3B3B",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", opacity: 0.7 },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCenter}
            sx={{
              bgcolor: "#FBC02D",
              color: "black",
              fontWeight: "bold",
              borderRadius: 2,
              px: 4,
              border: "2px solid #64B5F6",
              "&:hover": { bgcolor: "#f9a825" },
            }}
          >
            CREAR CENTRO
          </Button>
        </DialogActions>
      </Dialog>
    </BasicScreen>
  );
}
