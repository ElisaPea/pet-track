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

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openMenu, setOpenMenu] = useState(false);

  const titles = {
    [SCREEN.LOGIN]: "Iniciar Sesión",
    [SCREEN.HOME_VET]: "Centro veterinario",
  };

  const currentTitle = titles[location.pathname] || "Pet Track";

  const menuItems = [
    { label: "Home", screen: SCREEN.WELCOME_USER },
    { label: "HomeVet", screen: SCREEN.HOME_VET },
    { label: "Perfil", screen: SCREEN.settingsUser },
    { label: "PerfilVet", screen: SCREEN.settingsVet },
    { label: "Log in", screen: SCREEN.LOGIN },
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
              {menuItems.map((item) => (
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
                  onClick={() => navigate(item.screen)}
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
                  navigate(item.screen);
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
