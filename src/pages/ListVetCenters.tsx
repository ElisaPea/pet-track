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
import { getVetCenters } from "../api/query";
import { useEffect, useState } from "react";

export default function ListVetCenters() {
  // Logic and State in English
  const navigate = useNavigate();
  const [vetCenters, setVetCenters] = useState<any[]>([]); // List from DB
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [loading, setLoading] = useState(true); // Loading control

  // Array to keep track of which specific centers we have sent emails to
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  // Data fetching effect
  useEffect(() => {
    async function loadData() {
      const data = await getVetCenters();
      setVetCenters(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter logic
  const filteredCenters = vetCenters.filter((center) =>
    center.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Email handler
  const handleEmail = (
    centerId: string,
    emailCenter: string,
    nameCenter: string,
  ) => {
    console.log(`Sending request to: ${nameCenter} (${emailCenter})`); // Dev log in English

    // Track sent email visually in this screen
    setSentEmails((prev) => [...prev, centerId]);

    // 🌟 NUEVO: Guardamos en la memoria del navegador el nombre de la clínica
    localStorage.setItem("pendingVetRequest", nameCenter);

    // UX Email text in Spanish
    window.location.href = `mailto:${emailCenter}?subject=Solicitud de Asociación&body=Hola, me gustaría asociarme a su centro...`;
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
        {/* Back Button */}
        {/* <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            mb: 2,
          }}
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
        </Box> */}

        {/* UX Title in Spanish */}

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
                {/* UX Label in Spanish */}
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
                  placeholder="Filtra la lista..." // UX Placeholder in Spanish
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
                    input: {
                      color: "black",
                      px: 2,
                    },
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
                const isSent = sentEmails.includes(center.id);

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
                    <Typography sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      {center.name}
                    </Typography>

                    <Button
                      variant="contained"
                      disabled={isSent}
                      onClick={() =>
                        handleEmail(center.id, center.email, center.name)
                      }
                      sx={{
                        bgcolor: isSent ? "#9E9E9E" : "#66BB6A",
                        color: isSent ? "white" : "black",
                        borderRadius: 50,
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 3,
                        border: isSent ? "none" : "1px solid #2E7D32",
                        "&:hover": { bgcolor: isSent ? "#9E9E9E" : "#4CAF50" },
                        "&.Mui-disabled": {
                          bgcolor: "#BDBDBD",
                          color: "white",
                        },
                      }}
                    >
                      {/* UX Button Text in Spanish */}
                      {isSent
                        ? "CORREO ENVIADO, ESPERANDO RESPUESTA"
                        : "ENVIAR CORREO DE ASOCIACIÓN"}
                    </Button>
                  </Box>
                );
              })
            ) : (
              // UX Empty State in Spanish
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
