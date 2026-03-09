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
} from "@mui/material";
import FootprintIcon from "../components/FootprintIcon";
import { useState } from "react";

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

  const isLogin = mode === "login";
  const isProfessional = form.typeUser === "professional";

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

  const handleAccept = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = "El correo es obligatorio.";
    if (form.email && !testEmail(form.email))
      newErrors.email = "El correo no es válido.";
    if (!form.password) newErrors.password = "El password es obligatorio.";
    if (!isLogin && isProfessional) {
      if (!form.licenseNumber)
        newErrors.licenseNumber = "El Nº Colegiado es obligatorio.";
      if (!form.selectedVet)
        newErrors.selectedVet = "El Centro Vet es obligatorio.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Acción real de login/register aquí
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
                  type="password"
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

              {/* Tipo de usuario */}
              {!isLogin && (
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
              )}

              {/* Campos profesionales */}
              {!isLogin && isProfessional && (
                <>
                  {/* Nº Colegiado */}
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

                  {/* Centro Vet */}
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
                      <MenuItem value="Centro vet 1">Centro Vet 1</MenuItem>
                      <MenuItem value="Centro vet 2">Centro Vet 2</MenuItem>
                      <MenuItem value="Centro vet 3">Centro Vet 3</MenuItem>
                    </Select>
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
    </BasicScreen>
  );
}
