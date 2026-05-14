import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import FootprintIcon from "./FootprintIcon";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/signInQuery";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userAuthenticated, role } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openMenu, setOpenMenu] = useState(false);

  const titles = {
    [SCREEN.LOGIN]: "Iniciar Sesión",
    [SCREEN.HOME_VET]: "Centro veterinario",
  };

  const currentTitle = titles[location.pathname] || "Pet Track";

  //add prop screen to menuItems with the name of the screen
  const menuItems = [
    {
      label: "Home",
      screen: SCREEN.WELCOME_USER,
      onClick: () => navigate(SCREEN.WELCOME_USER),
      visible: userAuthenticated && role === "user",
    },
    {
      label: "HomeVet",
      screen: SCREEN.HOME_VET,
      onClick: () => navigate(SCREEN.HOME_VET),
      visible: userAuthenticated && role === "professional",
    },
    {
      label: "Perfil",
      screen: SCREEN.SETTINGS_USER,
      onClick: () => navigate(SCREEN.SETTINGS_USER),
      visible: userAuthenticated && role === "user",
    },
    {
      label: "PerfilVet",
      screen: SCREEN.SETTINGS_VET,
      onClick: () => navigate(SCREEN.SETTINGS_VET),
      visible: userAuthenticated && role === "professional",
    },
    {
      label: "Log in",
      screen: SCREEN.LOGIN,
      onClick: () => navigate(SCREEN.LOGIN),
      visible: !userAuthenticated,
    },
    {
      label: "Log out",
      screen: null,
      onClick: () => logout(navigate),
      visible: userAuthenticated,
    },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "#B2EBF2", color: "black" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LOGO */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <FootprintIcon />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate(SCREEN.LANDING_PAGE)}
            >
              Pet Track
            </Typography>
          </Stack>

          {/* TITULO SOLO DESKTOP */}
          {!isMobile && (
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {currentTitle}
            </Typography>
          )}

          {/* DESKTOP MENU */}
          {!isMobile && (
            <Stack direction="row" spacing={3}>
              {menuItems
                .filter((item) => item.visible)
                .map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    sx={{
                      textTransform: "none",
                      borderBottom:
                        location.pathname === item.screen
                          ? "2px solid black"
                          : "",
                    }}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Button>
                ))}
            </Stack>
          )}

          {/* MOBILE MENU BUTTON */}
          {isMobile && (
            <IconButton onClick={() => setOpenMenu(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* DRAWER MENU MOBILE */}
      <Drawer anchor="right" open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setOpenMenu(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
