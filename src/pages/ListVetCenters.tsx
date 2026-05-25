import BasicScreen from "../components/BasicScreen";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import { getVetCenters } from "../api/query"; // Importamos la query
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssociation } from "../context/AssociationContext";
import {
  createAssociationRequest,
  deleteAssociationRequest,
  unlinkAssociation,
} from "../api/createAssociationReq";

export default function ListVetCenters() {
  const navigate = useNavigate();
  const { userState } = useAuth();
  const {
    pendingRequests,
    associatedVets,
    acceptedRequests,
    rejectedRequests,
    refreshAssociations,
  } = useAssociation();

  const [vetCenters, setVetCenters] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getVetCenters();
      setVetCenters(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredCenters = vetCenters.filter((center) =>
    center.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- LÓGICA DE ASOCIACIÓN ---

  const handleRequestAssociation = async (vetCenter: any) => {
    try {
      await createAssociationRequest(
        userState.id,
        userState.email,
        vetCenter.email,
        "user",
      );

      // Enviamos el correo pasivo como querías
      const subject = encodeURIComponent("Solicitud de Asociación - Pet Track");
      const body = encodeURIComponent(
        `Hola ${vetCenter.name},\n\nEl usuario ${userState.name} ha solicitado asociarse a su centro a través de Pet Track. Por favor, entren en la aplicación para aceptar la solicitud.\n\nSaludos.`,
      );
      const mailtoUrl = `mailto:${vetCenter.email}?subject=${subject}&body=${body}`;

      const link = document.createElement("a");
      link.href = mailtoUrl;
      link.click();

      // window.location.href = mailtoUrl;

      await refreshAssociations(); // Refrescamos el contexto para que cambie el botón
    } catch (error) {
      console.error("Error al solicitar asociación:", error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    await deleteAssociationRequest(requestId);
    await refreshAssociations();
  };

  const handleUnlink = async (vetCenterEmail: string) => {
    const requestToUnlink = acceptedRequests.find(
      (r) => r.vetcenteremail.toLowerCase() === vetCenterEmail.toLowerCase(),
    );

    if (requestToUnlink) {
      await unlinkAssociation(requestToUnlink);
      await refreshAssociations();
    }
  };

  return (
    <BasicScreen>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            color: "#000000",
            mb: 0.5,
            textAlign: "center",
          }}
        >
          Asóciate a un centro veterinario
        </Typography>

        <Box sx={{ width: 100, height: 4, bgcolor: "#00BCD4", mb: 5 }} />

        <Box
          sx={{
            bgcolor: "#D1F2F5",
            width: "100%",
            maxWidth: 700,
            borderRadius: 10,
            p: { xs: 3, sm: 4 },
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={3} alignItems="center">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <IconButton
                  onClick={() => navigate(SCREEN.SETTINGS_USER)}
                  sx={{
                    bgcolor: "#FBC02D",
                    color: "black",
                    "&:hover": { bgcolor: "#f9a825" },
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                  <ArrowBackIcon fontSize="medium" />
                </IconButton>
                <Typography
                  sx={{
                    width: 200,
                    textAlign: { xs: "center", sm: "left" },
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Busca tu centro:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Filtra la lista..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <SearchIcon
                        sx={{ color: "black", ml: 1, opacity: 0.7 }}
                      />
                    ),
                  }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    width: { xs: "100%", sm: "50%" },
                    ml: "auto",
                    input: { color: "black", px: 2 },
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: "2px solid #333",
              borderRadius: 0,
              mt: 4,
              overflow: "hidden",
            }}
          >
            {loading ? (
              <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : filteredCenters.length > 0 ? (
              filteredCenters.map((center, index) => {
                // COMPROBACIONES DE ESTADO
                const isAssociated = associatedVets.some(
                  (v) => v.id === center.id,
                );
                const pendingRequest = pendingRequests.find(
                  (r) => r.vetcenteremail === center.email,
                );
                const isIRequested =
                  pendingRequest && pendingRequest.senderid === userState.id;
                const theyRequested =
                  pendingRequest && pendingRequest.senderid !== userState.id;
                const isRejected = rejectedRequests.some(
                  (r) => r.vetcenteremail === center.email,
                );

                return (
                  <Box
                    key={center.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", sm: "row" },
                      p: 2,
                      borderBottom:
                        index !== filteredCenters.length - 1
                          ? "2px solid #333"
                          : "none",
                      bgcolor: "#D1F2F5",
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: "600", fontSize: "1.1rem" }}
                      >
                        {center.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {center.email}
                      </Typography>
                    </Box>

                    {/* LÓGICA DE BOTONES DINÁMICA */}
                    {isAssociated ? (
                      <Button
                        variant="contained"
                        onClick={() => handleUnlink(center.email)}
                        sx={{
                          bgcolor: "#F02F0A",
                          color: "white",
                          borderRadius: 50,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 3,
                          "&:hover": { bgcolor: "#D82E0C" },
                        }}
                      >
                        ANULAR ASOCIACIÓN
                      </Button>
                    ) : isIRequested ? (
                      <Button
                        variant="contained"
                        onClick={() => handleCancelRequest(pendingRequest.id)}
                        sx={{
                          bgcolor: "#FFCA28",
                          color: "black",
                          borderRadius: 50,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 3,
                          "&:hover": { bgcolor: "#FFB300" },
                        }}
                      >
                        PETICIÓN ENVIADA (CANCELAR)
                      </Button>
                    ) : theyRequested ? (
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#66BB6A",
                          color: "black",
                          borderRadius: 50,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 3,
                          "&:hover": { bgcolor: "#4CAF50" },
                        }}
                      >
                        REVISAR INVITACIÓN (EN HOME)
                      </Button>
                    ) : isRejected ? (
                      //QUIERO QUE CUANDO SEA REJECTED NO SEA UN BOTON SINO UN TEXTO DE INFO
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 2,
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#FF8A80",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Petición Rechazada, Podrás Volver a Enviarla en Otro
                          Momento
                        </Typography>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleRequestAssociation(center)}
                        sx={{
                          bgcolor: "#66BB6A",
                          color: "black",
                          borderRadius: 50,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 3,
                          border: "1px solid #2E7D32",
                          "&:hover": { bgcolor: "#4CAF50" },
                        }}
                      >
                        SOLICITAR ASOCIACIÓN
                      </Button>
                    )}
                  </Box>
                );
              })
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography>No se encontraron centros veterinarios.</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </BasicScreen>
  );
}
