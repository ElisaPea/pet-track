import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "#B2EBF2", color: "black", width: "100%" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 30,
              height: 30,
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
            sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Pet Track
          </Typography>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              borderBottom:
                location.pathname === SCREEN.HOME ? "2px solid black" : "",
            }}
            onClick={() => {
              navigate(SCREEN.HOME);
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
