import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // I added this to dynamically update the NavBar title based on the current page.
  // 1. Mapping object for the titles; these can be changed as you see fit, they are just examples for now.
  const titles = {
    [SCREEN.HOME]: "Bienvenido a Pet Track",
    [SCREEN.LOGIN]: "Iniciar Sesión",
    [SCREEN.HOME_VET]: "Centro veterinario",
    // Add more as needed...
  };

  // 2. Get the current title based on the pathname. Defaults to 'Pet Track' if no match is found.
  const currentTitle = titles[location.pathname] || "Pet Track";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ bgcolor: "#B2EBF2", color: "black", width: "100%", zIndex: 1200 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* LEFT SECTION: Logo and App Name */}
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

        {/* CENTER SECTION: Dynamic Title */}
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}
        >
          {/* When data is fetched, we need to include the center and/or user names for better personalization, if you agree. */}
          {currentTitle}
        </Typography>

        {/* RIGHT SECTION: Navigation Buttons */}
        {/* <Stack direction="row" spacing={3}> */}
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
<<<<<<< HEAD
          {/* If the user is logged in, Malcon's test.*/}
=======

>>>>>>> test
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              borderBottom:
<<<<<<< HEAD
                location.pathname === SCREEN.HOME_VET ? "2px solid black" : "",
            }}
            onClick={() => {
              navigate(SCREEN.HOME_VET);
            }}
          >
            HomeVet
=======
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
>>>>>>> test
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
