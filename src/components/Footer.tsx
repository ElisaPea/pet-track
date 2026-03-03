import { Box, Stack, IconButton } from "@mui/material";
import { Instagram, LinkedIn, Mail } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: { xs: 4, sm: 8 },
        py: { xs: 2, sm: 4 },
        bgcolor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center">
        <IconButton color="primary" aria-label="Instagram">
          <Instagram />
        </IconButton>
        <IconButton color="primary" aria-label="LinkedIn">
          <LinkedIn />
        </IconButton>
        <IconButton color="primary" aria-label="Email">
          <Mail />
        </IconButton>
      </Stack>
      <Box
        sx={{
          mt: 1,
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          color: "#555",
        }}
      >
        &copy; {new Date().getFullYear()} Pet Track. Todos los derechos
        reservados.
      </Box>
    </Box>
  );
}
