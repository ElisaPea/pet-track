import BasicScreen from "../components/BasicScreen";
import {
  Box,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ClientDetailsPopup from "../components/ClientDetailsPopup";

import { useAuth } from "../context/AuthContext";
import AddClientPopup from "../components/AddClientPopup";
import { useState, useEffect } from "react";
import { getClientProfiles, getPetsByClient } from "../api/query";
import { useAssociation } from "../context/AssociationContext";
import AssociationRequestPopup from "../components/AssociationReuquestPopup";

export default function HomeVet() {
  const [clientList, setClientList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const { userState } = useAuth();
  const vetCenterId = userState?.veterinaryCenterId;

  const fetchClientsAndPets = async () => {
    try {
      const clientsData = await getClientProfiles(vetCenterId);
      if (clientsData) {
        const enrichedClients = await Promise.all(
          clientsData.map(async (client) => {
            const pets = await getPetsByClient(client.id);
            return { ...client, pets: pets || [] };
          }),
        );
        setClientList(enrichedClients);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    fetchClientsAndPets();
  }, [vetCenterId]);

  const handleOpenDetails = (id: string) => {
    setSelectedClientId(id);
    setIsModalOpen(true);
  };

  const filteredClients = clientList.filter((client) => {
    if (!client) return false;
    const query = searchQuery.toLowerCase();
    const clientName = client.name || "";
    const matchClientName = clientName.toLowerCase().includes(query);
    const matchPetName =
      client.pets &&
      client.pets.some((pet: any) => {
        const petName = pet.name || "";
        return petName.toLowerCase().includes(query);
      });
    return matchClientName || matchPetName;
  });

  const { pendingRequests, refreshAssociations } = useAssociation();
  const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);

  useEffect(() => {
    const hasReceivedRequests = pendingRequests.some(
      (req) => req.senderid !== userState?.veterinaryCenterId,
    );

    if (hasReceivedRequests) {
      setIsAssocModalOpen(true);
    } else {
      setIsAssocModalOpen(false);
    }
  }, [pendingRequests, userState?.veterinaryCenterId]);

  return (
    <BasicScreen>
      {isAssocModalOpen && (
        <AssociationRequestPopup
          open={isAssocModalOpen}
          onClose={() => setIsAssocModalOpen(false)}
          requests={pendingRequests}
          onRefresh={() => {
            refreshAssociations();
            fetchClientsAndPets();
          }}
        />
      )}

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Bienvenido {userState?.name}
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

      <Box
        sx={{
          bgcolor: "#B2EBF2",
          p: 4,
          borderRadius: 8,
          boxShadow: 1,
          maxWidth: 450,
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
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

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mt: 5,
          p: 2,
        }}
      >
        {filteredClients.length === 0 ? (
          <Box
            sx={{
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
              mt: 4,
            }}
          >
            <Typography sx={{ fontSize: "3.5rem", lineHeight: 1 }}>
              🔍
            </Typography>
            <Box>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#F57F17",
                  fontSize: "1.15rem",
                  mb: 0.5,
                }}
              >
                Sin resultados
              </Typography>
              <Typography variant="body2" sx={{ color: "#FF8F00" }}>
                No hay ningún cliente ni mascota que coincida con tu búsqueda.
              </Typography>
            </Box>
          </Box>
        ) : (
          filteredClients.map((client) => (
            <Box
              key={client.id}
              sx={{
                width: 320,
                bgcolor: "#00ADBA",
                boxShadow: 5,
                borderRadius: 4,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                position: "relative", // Para posicionar el badge si fuera necesario fuera de los bloques
              }}
            >
              {/* BADGE DE VINCULACIÓN (Si el cliente tiene userId) */}
              {client.userid && (
                <Chip
                  icon={
                    <VerifiedUserIcon
                      sx={{
                        fontSize: "1rem !important",
                        color: "white !important",
                      }}
                    />
                  }
                  label="VINCULADO"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -12,
                    right: 15,
                    bgcolor: "#66BB6A",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.65rem",
                    boxShadow: 3,
                    zIndex: 1,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              )}

              {/* 1. UPPER SECTION: Client Data */}
              <Box sx={{ bgcolor: "white", borderRadius: 3, p: 1.5 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "gray" }}
                  >
                    Cliente:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      textAlign: "right",
                    }}
                  >
                    {client.name}
                  </Typography>
                </Stack>
              </Box>

              {/* 2. LOWER SECTION: Pet Data and Button */}
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 65,
                    height: 65,
                    borderRadius: "15px",
                    boxShadow: 1,
                    bgcolor: "#B2EBF2",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  {client.pets && client.pets.length > 0
                    ? (client.pets[0].name || "M").charAt(0).toUpperCase()
                    : (client.name || "C").charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "gray", display: "block" }}
                  >
                    Mascota(s):
                  </Typography>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "0.85rem",
                    }}
                  >
                    {client.pets && client.pets.length > 0
                      ? client.pets.map((p: any) => p.name).join(", ")
                      : "(Sin mascotas)"}
                  </Typography>
                </Box>

                <IconButton
                  sx={{
                    bgcolor: "#00ADBA",
                    color: "white",
                    borderRadius: "50%",
                    p: 1,
                    "&:hover": { bgcolor: "#00838F" },
                  }}
                  onClick={() => handleOpenDetails(client.id)}
                >
                  <ArrowRightAltIcon />
                </IconButton>

                {/* MODAL DE DETALLES */}
                {isModalOpen && selectedClientId === client.id && (
                  <ClientDetailsPopup
                    open={isModalOpen && selectedClientId === client.id}
                    onClose={() => {
                      setIsModalOpen(false);
                      fetchClientsAndPets(); // Refrescamos al cerrar por si hubo cambios
                    }}
                    clientData={client}
                    vetCenterId={vetCenterId}
                  />
                )}
              </Box>
            </Box>
          ))
        )}
        <AddClientPopup
          open={isAddClientOpen}
          onClose={() => {
            setIsAddClientOpen(false);
            fetchClientsAndPets();
          }}
          vetCenterId={vetCenterId}
        />
      </Box>
    </BasicScreen>
  );
}
