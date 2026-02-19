import BasicScreen from "../components/BasicScreen";
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Stack,
} from "@mui/material";
import { Instagram, LinkedIn, Mail, ArrowForward } from "@mui/icons-material";
import cat from "../assets/cat-test.png";

export default function Home() {
  return (
    <BasicScreen>
      <Container maxWidth="md">
        {/* HEADER / LOGO PRINCIPAL */}
        <Box sx={{ textAlign: "center", mt: 6, mb: 4 }}>
          <Box
            sx={{
              display: "inline-block",
              bgcolor: "#B2EBF2",
              px: 4,
              py: 2,
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
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
          {[1, 2, 3].map((item) => (
            <Grid size={{ xs: 4 }} key={item}>
              <Card sx={{ borderRadius: 8, height: 180 }}>
                <CardMedia component="img" image={cat} alt="Pet" />
              </Card>
            </Grid>
          ))}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: "#B2EBF2",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: "#ccc",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: "#ccc",
                borderRadius: "50%",
              }}
            />
          </Stack>
        </Grid>

        {/* SECCIÓN SERVICIOS */}
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 4 }}>
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
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=500"
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
              src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=500"
              sx={{ width: "100%", borderRadius: 8 }}
            />
          </Grid>
        </Grid>

        {/* FOOTER */}
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <IconButton>
              <Instagram />
            </IconButton>
            <IconButton>
              <LinkedIn />
            </IconButton>
            <IconButton>
              <Mail />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </BasicScreen>
  );
}

//   const [count, setCount] = useState(0);
//   const [visibleColors, setVisibleColors] = useState(false);
// <>
//   <button
//     className="border p-2 rounded-xl bg-red-500 hover:bg-red-300 cursor-pointer text-white"
//     onClick={() => setVisibleColors(!visibleColors)}
//   >
//     {visibleColors ? "Hide colors" : "Show colors"}
//   </button>

//   {visibleColors && (
//     <div className="flex flex-col gap-2">
//       <div className="bg-red-500 text-white">red - tailwind</div>
//       <div style={{ backgroundColor: "#ef4444", color: "#ffffff" }}>
//         red - css
//       </div>
//       <div className="bg-blue-500 text-white">blue - tailwind</div>
//       <div style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}>
//         blue - css
//       </div>
//       <div className="bg-green-500 text-white">green - tailwind</div>
//       <div style={{ backgroundColor: "#16a34a", color: "#ffffff" }}>
//         green - css
//       </div>
//       <div className="bg-yellow-400 text-black">yellow - tailwind</div>
//       <div style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}>
//         yellow - css
//       </div>
//       <div className="bg-purple-500 text-white">purple - tailwind</div>
//       <div style={{ backgroundColor: "#9333ea", color: "#ffffff" }}>
//         purple - css
//       </div>
//       <div className="bg-gray-300 text-black">gray - tailwind</div>
//       <div style={{ backgroundColor: "#9ca3af", color: "#ffffff" }}>
//         gray - css
//       </div>
//     </div>
//   )}

//   <div className="items-center flex flex-col">
//     <a href="https://react.dev" target="_blank">
//       <img src={reactLogo} className="logo react" alt="React logo" />
//     </a>

//     <h1 className="text-2xl font-bold">Vite + React</h1>
//     <h2>PRUEBA OSCAR</h2>
//     <div className="card">
//       <button
//         className="bg-blue-500 text-white p-2 rounded"
//         onClick={() => setCount((count) => count + 1)}
//       >
//         count is {count}
//       </button>
//       <p className="text-lg">
//         Edit <code>src/App.tsx</code> and save to test HMR
//       </p>
//     </div>
//     <p className="text-sm">
//       Pulsa aquí para ver más sobre los logos
//     </p>
//   </div>
// </>
