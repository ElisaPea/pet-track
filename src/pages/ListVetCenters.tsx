import BasicScreen from "../components/BasicScreen";
import { Box, Typography, TextField, Button, Stack, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";
import { getVetCenters } from "../api/get-user";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

export default function ListVetCenters() {
  const navigate = useNavigate();
  const [vetCenters, setVetCenters] = useState<any[]>([]); // Lista que vendrá de la DB
  const [searchTerm, setSearchTerm] = useState("");      // Para el buscador
  const [loading, setLoading] = useState(true);          // Control de carga

  // EFECTO PARA DISPARAR LA CONSULTA A SUPABASE
  useEffect(() => {
    async function loadData() {
      const data = await getVetCenters();
      setVetCenters(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  // Lógica de filtrado para el buscador
  const filteredCenters = vetCenters.filter((center) =>
    center.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmail = (emailCenter: string, nameCenter: string) => {
    console.log(`Enviando solicitud a: ${nameCenter} (${emailCenter})`);
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
          mt: 8, // Margen superior para centrar visualmente
          position: "relative",
        }}
      >
          {/* Botón de atrás arriba, fuera del recuadro y amarillo */}
          <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <IconButton
            onClick={() => navigate(SCREEN.settingsUser)}
            sx={{
              bgcolor: "#FBC02D", // Amarillo como tus otros botones
              color: "black",
              "&:hover": { bgcolor: "#f9a825" },
              boxShadow: "0px 2px 5px rgba(0,0,0,0.2)", // Un poco de sombra para que resalte
            }}
          >
          <ArrowBackIcon fontSize="medium" />
          </IconButton>
        </Box>
        
          {/* Tipografia Asociarte a un centro veterinario */}
            <Typography variant="h4" sx={{ fontWeight: "600", color: "#000000", mb: 0.5 }}>
              Asociate a un centro veterinario
            </Typography>

            {/* Línea decorativa */}
            <Box sx={{ width: 100, height: 4, bgcolor: "#00BCD4", mb: 5 }} />

        {/* Contenedor Principal (Cuadrado azul claro) */}
        <Box
          sx={{
            bgcolor: "#D1F2F5", // Azul pastel de la imagen
            width: "100%",
            maxWidth: 700,
            borderRadius: 10, // Bordes muy redondeados
            p: 4,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        
        >
          {/* Formulario */}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Stack spacing={3} alignItems="center">
              {/* Busca tu centro */}
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Typography
                  sx={{ width: 200, textAlign: "center", fontWeight: "bold", fontSize: "1.5rem"}}
                >
                  Busca tu centro:
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Filtra la lista..." 
                  onChange ={(e) =>setSearchTerm(e.target.value)}//conectar el buscador con onChange ={(e) =>setSearchTerm(e.target.value)}
                  InputProps={{
                    disableUnderline: true,// Añadimos la lupa para realizar busqueda
                     startAdornment: (
                    <SearchIcon sx={{ color: "black", ml: 1, opacity: 0.7 }} />
                     ),
                     }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 50,
                    px: 2,
                    py: 0.4,
                    width:"50%",
                    ml: "auto",
                    input: { 
                    color: "black", // Texto blanco para que contraste
                    px: 2}
                  }}
                />
              </Stack>
              </Stack>      
          </Box>
  
        {/* Línea decorativa ajustada */}
        <Box sx={{ width: 200, height: 4, bgcolor: "#00BCD4", mb: 4, alignSelf: "center" }} />

          {/* COMIENZA TABLA DE DATOS DINÁMICA */}
          <Paper elevation={0} sx={{ border: "2px solid #333", borderRadius: 0, mt: 4, overflow: "hidden" }}>
            {loading ? (
              // Mientras la base de datos responde, mostramos carga
              <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : filteredCenters.length > 0 ? (
              // Mapeamos los datos filtrados usando paréntesis () para el retorno del JSX
              filteredCenters.map((center, index) => (
                <Box
                  key={center.id} // Usamos el ID único de Supabase
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: index !== filteredCenters.length - 1 ? "2px solid #333" : "none",
                    bgcolor: "#D1F2F5",
                  }}
                >
                  <Typography sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                    {center.name}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => handleEmail(center.email, center.name)}
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
                    ENVIAR CORREO DE ASOCIACIÓN
                  </Button>
                </Box>
              ))
            ) : (
              // Mensaje si no hay datos o el filtro no coincide
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

