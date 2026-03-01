import BasicScreen from "../components/BasicScreen";
import { Typography, Container, Box, Grid, IconButton } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import PetCarousel from "../components/PetCarousel";

const serviceImages = [
  "https://plus.unsplash.com/premium_photo-1661915652986-fe818e1973f9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  "https://plus.unsplash.com/premium_photo-1661629144388-851a3fe74096?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <BasicScreen>
      <Container maxWidth="lg">
        {/* HEADER / LOGO PRINCIPAL */}
        <Box
          sx={{
            textAlign: "center",
            mt: { xs: 4, sm: 6 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              bgcolor: "#B2EBF2",
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: "50px",
              boxShadow: 1,
            }}
          >
            <Typography variant="h4" component="h1">
              Pet Track
            </Typography>
            <Typography variant="subtitle1">
              Cuidamos de tus mascotas
            </Typography>
          </Box>
        </Box>

        {/* SLIDER IMAGES (PLACEHOLDERS) */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ mb: { xs: 4, sm: 6 } }}
        >
          <PetCarousel />
        </Grid>

        {/* SECCIÓN SERVICIOS */}
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          Servicios
          <Box
            sx={{
              width: 60,
              height: 4,
              bgcolor: "#00BCD4",
              margin: "auto",
              mt: 1,
            }}
          />
        </Typography>

        {/* BLOQUE VETERINARIO */}
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ mb: { xs: 6, sm: 8 } }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={serviceImages[0]}
              sx={{ width: "100%", borderRadius: 8 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              ¿Centro veterinario?
            </Typography>
            <Box sx={{ bgcolor: "#E0F7FA", p: 3, borderRadius: 10, mb: 2 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                PetTrack revoluciona la forma en que gestionas la salud animal.
                Centraliza historiales, fichas de clientes y permite
                comunicación directa con los dueños.
              </Typography>
            </Box>
            <Box textAlign="right">
              <IconButton
                onClick={() => {
                  navigate(SCREEN.LOGIN);
                }}
                sx={{
                  bgcolor: "#00BCD4",
                  color: "white",
                  "&:hover": { bgcolor: "#00838F" },
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* BLOQUE PARTICULAR */}
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction={{ xs: "column-reverse", md: "row" }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              ¿Particular?
            </Typography>
            <Box sx={{ bgcolor: "#E0F7FA", p: 3, borderRadius: 10, mb: 2 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Acceso personal y seguro a la salud de tu compañero. Consulta el
                historial clínico, resultados de exámenes y fotos de seguimiento
                en cualquier momento.
              </Typography>
            </Box>
            <Box textAlign="right">
              <IconButton
                onClick={() => {
                  navigate(SCREEN.LOGIN);
                }}
                sx={{
                  bgcolor: "#00BCD4",
                  color: "white",
                  "&:hover": { bgcolor: "#00838F" },
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={serviceImages[1]}
              sx={{ width: "100%", borderRadius: 8 }}
            />
          </Grid>
        </Grid>
      </Container>
    </BasicScreen>
  );
}
