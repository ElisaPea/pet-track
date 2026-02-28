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
            sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: "bold" }}
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
                location.pathname === SCREEN.LANDING_PAGE
                  ? "2px solid black"
                  : "",
            }}
            onClick={() => {
              navigate(SCREEN.LANDING_PAGE);
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
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
