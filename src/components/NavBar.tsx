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
  Chip, // Añadido
  Menu, // Añadido
  MenuItem, // Añadido
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessIcon from "@mui/icons-material/Business"; // Icono para los centros
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Icono flecha
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import FootprintIcon from "./FootprintIcon";
import { useAuth } from "../context/AuthContext";
import { useAssociation } from "../context/AssociationContext"; // Hook de asociación
import { logout } from "../api/signInQuery";

// Colores pastel para los badges
const BADGE_COLORS = ["#FFD1DC", "#B3E5BE", "#FFECB3", "#C5CAE9", "#F8BBD0"];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userAuthenticated, role } = useAuth();
  const { associatedVets } = useAssociation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openMenu, setOpenMenu] = useState(false);

  // Estado para el menú de "Varios centros"
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const titles = {
    [SCREEN.LOGIN]: "Iniciar Sesión",
    [SCREEN.HOME_VET]: "Centro veterinario",
  };

  const currentTitle = titles[location.pathname] || "Pet Track";

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

            {/* --- SECCIÓN DE BADGES (SOLO USER) --- */}
            {!isMobile &&
              userAuthenticated &&
              role === "user" &&
              associatedVets.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                  {associatedVets.length <= 2 ? (
                    associatedVets.map((vet, index) => (
                      <Chip
                        key={vet.id}
                        label={vet.name}
                        size="small"
                        icon={<BusinessIcon style={{ fontSize: "0.9rem" }} />}
                        sx={{
                          bgcolor: BADGE_COLORS[index % BADGE_COLORS.length],
                          fontWeight: "500",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))
                  ) : (
                    <>
                      <Chip
                        label={`+${associatedVets.length} Centros`}
                        size="small"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        onDelete={(e) => setAnchorEl(e.currentTarget as any)}
                        deleteIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          bgcolor: "#E0F7FA",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                      />
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        {associatedVets.map((vet, index) => (
                          <MenuItem
                            key={vet.id}
                            onClick={() => setAnchorEl(null)}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor:
                                  BADGE_COLORS[index % BADGE_COLORS.length],
                                mr: 1.5,
                              }}
                            />
                            <Typography variant="body2">{vet.name}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  )}
                </Stack>
              )}
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
            {menuItems
              .filter((item) => item.visible) // Importante filtrar también en mobile
              .map((item) => (
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
