import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

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
            sx={{ textTransform: "none", borderBottom: "2px solid black" }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
