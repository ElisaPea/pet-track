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
  Tooltip,
  Fab, // Added for the Floating Action Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import FootprintIcon from "./FootprintIcon";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/signInQuery";

// External documentation link (GitBook manual) 
const HELP_URL = "https://dam-6.gitbook.io/manual-usuario-pettrack";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userAuthenticated, role } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openMenu, setOpenMenu] = useState(false);

  // Screen titles mapped to current routes
  const titles = {
    [SCREEN.LOGIN]: "Sign In",
    [SCREEN.HOME_VET]: "Vet Center",
  };

  const currentTitle = titles[location.pathname] || "Pet Track";

  // Menu items visibility and navigation logic
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
      label: "Profile",
      screen: SCREEN.SETTINGS_USER,
      onClick: () => navigate(SCREEN.SETTINGS_USER),
      visible: userAuthenticated && role === "user",
    },
    {
      label: "ProfileVet",
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

  // Handler to open the manual in a new window
  const handleHelpClick = () => {
    window.open(HELP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "#B2EBF2", color: "black" }} // PetTrack main navbar color
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          
          {/* LEFT: BRANDING & LOGO */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <FootprintIcon />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1.1rem" },
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate(SCREEN.LANDING_PAGE)}
            >
              Pet Track
            </Typography>
          </Stack>

          {/* CENTER: DYNAMIC PAGE TITLE (Desktop Only) */}
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

          {/* RIGHT: NAVIGATION (Cleaned up, help button moved to FAB) */}
          <Stack direction="row" spacing={isMobile ? 1 : 2} alignItems="center">
            
            {/* DESKTOP MENU LINKS */}
            {!isMobile && (
              <Stack direction="row" spacing={2}>
                {menuItems
                  .filter((item) => item.visible)
                  .map((item) => (
                    <Button
                      key={item.label}
                      color="inherit"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        borderBottom:
                          location.pathname === item.screen
                            ? "2px solid black"
                            : "none",
                      }}
                      onClick={item.onClick}
                    >
                      {item.label}
                    </Button>
                  ))}
              </Stack>
            )}

            {/* MOBILE HAMBURGER MENU */}
            {isMobile && (
              <IconButton onClick={() => setOpenMenu(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* 🌟 NEW INCORPORATION: Floating Action Button (FAB) for Help */}
      {/* This solves the UX issue by removing the icon from the header and placing it in the 'hot zone' */}
      <Tooltip title="Help / User Manual" placement="left" arrow>
        <Fab
          onClick={handleHelpClick}
          aria-label="help"
          sx={{
            position: "fixed",
            bottom: { xs: 20, sm: 30 },
            right: { xs: 20, sm: 30 },
            bgcolor: "white",            // White background as requested
            color: "#00BCD4",            // Cyan icon from PetTrack logo
            border: "2px solid #00BCD4", // Cyan border matching the branding
            zIndex: 2000,                // Stays above all other content
            "&:hover": {
              bgcolor: "#f0fdfe",        // Very light cyan tint on hover
              transform: "scale(1.1)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>

      {/* MOBILE NAVIGATION DRAWER */}
      <Drawer anchor="right" open={openMenu} onClose={() => setOpenMenu(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems
              .filter((item) => item.visible)
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
            {/* Additional help access inside the mobile menu */}
            <ListItemButton onClick={handleHelpClick}>
              <ListItemText primary="User Manual" sx={{ color: "#00BCD4" }} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
