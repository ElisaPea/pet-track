import BasicScreen from "../components/BasicScreen";
import {
  Box,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"; // Alternative arrow icon can be used if preferred
import ClientDetailsPopup from "../components/ClientDetailsPopup";
import AddClientPopup from '../components/AddClientPopup';
import { useState, useEffect } from "react";
import { getClientProfiles, getPetsByClient } from "../api/query";

export default function HomeVet() {
  // Estado para almacenar la lista de clientes junto con sus mascotas
  const [clientList, setClientList] = useState<any[]>([]);

  // Estado para rastrear lo que el usuario escribe en el buscador
  const [searchQuery, setSearchQuery] = useState("");

  // Create the 'switch'. It is closed by default (false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // UseEffect que llama a las APIs al montar el componente
  useEffect(() => {
    const fetchClientsAndPets = async () => {
      try {
        // 1. Obtenemos los clientes
        const clientsData = await getClientProfiles();

        if (clientsData) {
          // 2. Por cada cliente, traemos sus mascotas usando Promise.all para que sea simultáneo
          const enrichedClients = await Promise.all(
            clientsData.map(async (client) => {
              const pets = await getPetsByClient(client.id);
              // Devolvemos el cliente sumándole un nuevo campo "pets"
              return { ...client, pets: pets || [] };
            })
          );
          setClientList(enrichedClients);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchClientsAndPets();
  }, []);

  // Function to open the popup with a specific ID
  const handleOpenDetails = (id: string) => {
    setSelectedClientId(id);
    setIsModalOpen(true);
  };

  // Lógica de filtrado dinámico. Extraemos los que coinciden con el texto.
  const filteredClients = clientList.filter((client) => {
    if (!client) return false;
    const query = searchQuery.toLowerCase();
    const clientName = client.name || "";
    const matchClientName = clientName.toLowerCase().includes(query);
    const matchPetName = client.pets && client.pets.some((pet: any) => {
      const petName = pet.name || "";
      return petName.toLowerCase().includes(query);
    });
    return matchClientName || matchPetName;
  });

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
            placeholder="Nombre o nombre de mascota..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            // --- THIS IS THE KEY LINE FOR CYPRESS ---
            data-testid="add-client-button"
            sx={{
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "#f5f5f5" },
              width: 50,
              height: 50,
            }}
            onClick={() => setIsAddClientOpen(true)}
          >
            <AddIcon sx={{ fontSize: 30, color: "#00ADBA" }} />
          </IconButton>
        </Stack>
      </Box>
      {/* End of Actions Bar */}

      {/* DYNAMIC CONTAINER */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // Enable flex wrapping
          gap: 3, // Gap between card elements
          justifyContent: "center", // Center justify content when items are fewer than row width
          mt: 5,
          p: 2,
        }}
      >
        {filteredClients.length === 0 ? (
           <Box sx={{ 
             bgcolor: "#FFF8E1", 
             borderRadius: "24px", 
             p: 4, 
             display: "flex", 
             flexDirection: "column", 
             alignItems: "center", 
             textAlign: "center",
             gap: 1.5, 
             boxShadow: "0 4px 15px rgba(255, 202, 40, 0.15)",
             maxWidth: 400,
             mx: "auto", 
             mt: 4
           }}>
             <Typography sx={{ fontSize: "3.5rem", lineHeight: 1 }}>🔍</Typography>
             <Box>
               <Typography sx={{ fontWeight: "bold", color: "#F57F17", fontSize: "1.15rem", mb: 0.5 }}>
                 Sin resultados
               </Typography>
               <Typography variant="body2" sx={{ color: "#FF8F00" }}>
                 No hay ningún cliente ni mascota que coincida con tu búsqueda.
               </Typography>
             </Box>
           </Box>
        ) : (
        filteredClients.map((client) => (
          /* Clients cards */
          <Box
            key={client.id}
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
                </Box>
                <Box sx={{ textAlign: "right", flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {client.name}
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
                variant="rounded" // Makes the image square with rounded corners
                sx={{
                  width: 70, // Avatar size
                  height: 70, // Avatar size
                  borderRadius: "15px", // More subtle rounded corners
                  boxShadow: 2,
                  bgcolor: "#B2EBF2",
                  color: "black",
                }}
              >
                {/* Si tiene mascotas, la inicial de la primera, si no, la del cliente */}
                {client.pets && client.pets.length > 0
                  ? (client.pets[0].name || "M").charAt(0).toUpperCase()
                  : (client.name || "C").charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  Mascota(s):
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "black", fontSize: "0.85rem" }}
                >
                  {client.pets && client.pets.length > 0
                    ? client.pets.map((p: any) => p.name).join(", ")
                    : "(Sin mascotas)"}
                </Typography>
              </Box>

              <IconButton
                sx={{
                  bgcolor: "#00ADBA", // Turquoise button background color
                  color: "white", // Icon color
                  borderRadius: "50%", // Circular button
                  p: 1, // Internal padding
                  ml: 2, // Left margin to separate it
                  "&:hover": { bgcolor: "#00838F" }, // Change color on hover
                }}
                onClick={() => handleOpenDetails(client.id)} // Pass the client.id to the button handler
              >
                <ArrowRightAltIcon /> {/* Arrow icon */}
              </IconButton>

              {/* POPUPS SECTION */}
              {/* CLIENT DETAILS POPUP: Place the Modal at the bottom. It will be 'listening' to the isModalOpen switch. */}
              <ClientDetailsPopup
                open={isModalOpen && selectedClientId === client.id}
                onClose={() => setIsModalOpen(false)}
                clientData={client}
              />
              {/* ADD CLIENT POPUP: Triggered from the top "+" button */}
              <AddClientPopup
                open={isAddClientOpen}
                onClose={() => setIsAddClientOpen(false)}
              />
            </Box>
          </Box>
        ))
        )}
      </Box>
    </BasicScreen>
  );
}
