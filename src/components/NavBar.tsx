import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ bgcolor: "#B2EBF2", color: "black", width: "100%", zIndex: 1200 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: { xs: 28, sm: 30 },
              height: { xs: 28, sm: 30 },
              bgcolor: "white",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            🐾
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(SCREEN.LANDING_PAGE);
            }}
          >
            Pet Track
          </Typography>
        </Stack>
        <Stack direction="row" spacing={{ xs: 1, sm: 3 }}>
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              borderBottom:
                location.pathname === SCREEN.WELCOME_USER
                  ? "2px solid black"
                  : "",
            }}
            onClick={() => {
              navigate(SCREEN.WELCOME_USER);
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              borderBottom:
                location.pathname === SCREEN.LOGIN ? "2px solid black" : "",
            }}
            onClick={() => {
              navigate(SCREEN.LOGIN);
            }}
          >
            Log in
          </Button>

          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              borderBottom:
                location.pathname === SCREEN.settingsUser
                  ? "2px solid black"
                  : "",
            }}
            onClick={() => {
              navigate(SCREEN.settingsUser); //No es correcto dejarlo en el Home, se debe proteger, si no está el login hecho no debería aparecer.
            }}
          >
            Perfil
          </Button>

          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              borderBottom:
                location.pathname === SCREEN.settingsVet
                  ? "2px solid black"
                  : "",
            }}
            onClick={() => {
              navigate(SCREEN.settingsVet); //No es correcto dejarlo en el Home, se debe proteger, si no está el login hecho no debería aparecer.
            }}
          >
            PerfilVet
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
