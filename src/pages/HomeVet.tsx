import BasicScreen from "../components/BasicScreen";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets"; // Icono de la huellita
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"; // Alternative arrow icon can be used if preferred
import beni from "../assets/Beni_perfil.jpeg";
import test1 from "../assets/test_1.jpg";
import test2 from "../assets/test_2.jpeg";
import arya from "../assets/arya.jpeg";

export default function HomeVet() {
  // Mock data array
  const petList = [
    { id: 1, client: "Malcon", dni: "A1234567", pet: "Beni", image: beni },
    { id: 2, client: "Aroa", dni: "B9876543", pet: "Luna", image: undefined }, // Null image state for testing fallback UI
    { id: 3, client: "Ventura", dni: "C4561237", pet: "Thor", image: test2 },
    { id: 4, client: "Elisa", dni: "D1928374", pet: "Atena", image: arya },
    // Add as many items as needed...
  ];

  return (
    <BasicScreen>
      {/* Welcome Vet Title & Blue Line */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Bienvenido Malcon
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#00ADBA",
            borderRadius: "50px",
            width: 75,
            height: 5,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
            mt: 1,
            ml: "auto",
            mr: "auto",
          }}
        />
      </Box>

      {/* Actions Bar: Search and Create */}
      <Box
        sx={{
          bgcolor: "#B2EBF2",
          p: 4,
          borderRadius: 8,
          boxShadow: 1,
          maxWidth: 450, // Limit the maximum width to prevent full-screen expansion.
          mx: "auto", // "Horizontal centering
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3, // Gap between children
        }}
      >
        {/* 1. SEARCH SECTION */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Buscar cliente o mascota:
          </Typography>
          <TextField
            fullWidth
            placeholder="Nombre, DNI o nombre de mascota..."
            variant="outlined"
            sx={{
              bgcolor: "white",
              borderRadius: 50,
              "& fieldset": { border: "none" },
              boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.05)",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 2. ADD SECTION */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Agregar un nuevo cliente:
          </Typography>
          <IconButton
            color="primary"
            sx={{
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#f5f5f5" },
              width: 50,
              height: 50,
            }}
            onClick={() => console.log("Agregar cliente")}
          >
            <AddIcon sx={{ fontSize: 30, color: "#00ADBA" }} />
          </IconButton>
        </Stack>
      </Box>
      {/* End of Actions Bar */}

      {/* CONTENEDOR DINÁMICO */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // Permite que bajen a la siguiente fila
          gap: 3, // Espacio entre tarjetas
          justifyContent: "center", // Centra las tarjetas si sobra espacio
          mt: 5,
          p: 2,
        }}
      >
        {petList.map((item) => (
          /* Clients cards */
          <Box
            key={item.id}
            sx={{
              width: 300, // Adjust width as necessary for proper scaling
              bgcolor: "#00ADBA",
              boxShadow: 5,
              borderRadius: 4,
              p: 2, // Inner padding
              display: "flex",
              flexDirection: "column", // Vertical alignment
              gap: 1.5, // Gap between the two white blocks
            }}
          >
            {/* 1. UPPER SECTION: Client Data */}
            <Box
              sx={{
                bgcolor: "white", // White background for the upper block
                borderRadius: 3, // Rounded corners for the upper block
                p: 1.5, // Internal padding for the upper block
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    Cliente:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    DNI:
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {item.client}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {item.dni}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* 2. LOWER SECTION: Pet Data and Button */}
            <Box
              sx={{
                bgcolor: "white", // White background for the lower block
                borderRadius: 3, // Rounded corners for the lower block
                p: 1.5, // Internal padding for the lower block
                display: "flex",
                alignItems: "center", // Vertical alignment of the elements
                gap: 1.5, // Gap between the avatar, text, and button
              }}
            >
              <Avatar
                src={item.image} // Example image
                alt={item.pet} // Alt text for accessibility
                variant="rounded" // Makes the image square with rounded corners
                sx={{
                  width: 70, // Avatar size
                  height: 70, // Avatar size
                  borderRadius: "15px", // More subtle rounded corners
                  boxShadow: 2, // Corregido el valor de sombra para que sea más natural
                  bgcolor: "#B2EBF2",
                  color: "black",
                }}
              >
                {/* Inicial si no hay imagen */}
                {item.pet.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  Nombre:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  {item.pet}
                </Typography>
              </Box>

              <IconButton
                sx={{
                  bgcolor: "#00ADBA", // Turquoise button background color
                  color: "white", // Icon color
                  borderRadius: "50%", // Circular button
                  p: 1, // Internal padding
                  ml: 2, // Left margin to separate it
                }}
                onClick={() => console.log(`Abrir popup de ${item.pet}`)} // Modify
              >
                <ArrowRightAltIcon /> {/* Arrow icon */}
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </BasicScreen>
  );
}
