import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import BasicScreen from "../components/BasicScreen";
import { PopupCreatePetUser } from "../components/PopupCreatePetUser";
import { getPetsByUser, getPetById } from "../api/query";
import { supabase } from "../api/supabaseClient";

const TEST_USER_ID = "2427a02c-b1c9-423e-9aab-4ed448c34b5b";

// Calcula la edad en años a partir de una fecha ISO
function calcularEdad(birthdate: string): string {
  if (!birthdate) return "Desconocida";
  const años = new Date().getFullYear() - new Date(birthdate).getFullYear();
  return `${años} año${años !== 1 ? "s" : ""}`;
}

export default function WelcomeUser() {
  const [open, setOpen] = useState(false);
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<any | null>(
    null,
  );

  const [userName, setUserName] = useState(""); // ✅ añadido

  const fetchMascotas = async () => {
    setLoadingPets(true);
    try {
      const data = await getPetsByUser(TEST_USER_ID);
      setMascotas(data);
    } catch (e) {
      console.error("Error al cargar mascotas:", e);
    } finally {
      setLoadingPets(false);
    }
  };

  // Carga inicial mascotas
  useEffect(() => {
    fetchMascotas();
  }, []);

  //  cargar nombre desde tabla User
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("name")
        .eq("id", TEST_USER_ID)
        .single();

      if (!error && data) {
        setUserName(data.name || "");
      } else {
        console.error("Error cargando usuario:", error);
      }
    };

    loadUser();
  }, []);

  return (
    <BasicScreen>
      <section>
        {/* Title */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Bienvenido {userName}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#00ADBA",
              borderRadius: "50px",
              width: 75,
              height: 5,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              ml: "auto",
              mr: "auto",
              mt: 1,
            }}
          />
        </Box>

        {/* MAIN BOX CONTAINER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 7,
            columnGap: 8,
            rowGap: 3.5,
          }}
        >
          {/* ADD PET BOX */}
          <Box
            sx={{
              bgcolor: "#00ADBA",
              borderRadius: 10,
              width: 350,
              height: 240,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FFFFFF",
                color: "black",
                borderRadius: 10,
                "&:hover": { bgcolor: "#FDC435" },
              }}
              onClick={() => setOpen(true)}
            >
              !AÑADE UNA MASCOTA!
            </Button>
          </Box>

          {/* Loading state */}
          {loadingPets && (
            <Box
              sx={{
                width: 350,
                height: 240,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ color: "#00ADBA" }} />
            </Box>
          )}

          {/* Box for n pets */}
          {!loadingPets &&
            mascotas.map((mascota) => (
              <Box
                key={mascota.id}
                sx={{
                  bgcolor: "#00ADBA",
                  borderRadius: 10,
                  width: 350,
                  height: 240,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    width: "100%",
                  }}
                >
                  {/* Main info + image  */}
                  <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
                    <Box
                      sx={{
                        bgcolor: "white",
                        borderRadius: 5,
                        flex: 1,
                        height: 100,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                        p: 1.5,
                      }}
                    >
                      <Typography variant="h6" textAlign="center">
                        {mascota.name}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        - {mascota.breed || "Raza desconocida"}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        - {calcularEdad(mascota.birthdate)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        bgcolor: "white",
                        borderRadius: 5,
                        width: 100,
                        height: 100,
                        flexShrink: 0,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography fontSize={40}>🐾</Typography>
                    </Box>
                  </Box>

                  <Box
                    onClick={async () => {
                      try {
                        const petData = await getPetById(mascota.id);
                        setMascotaSeleccionada(petData);
                        setOpen(true);
                      } catch (e) {
                        console.error("Error cargando mascota:", e);
                      }
                    }}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 5,
                      width: "100%",
                      height: 80,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#BEF1F3" },
                    }}
                  >
                    <Typography variant="h6">Información adicional</Typography>
                  </Box>
                </Box>
              </Box>
            ))}

          {!loadingPets && mascotas.length === 0 && (
            <Typography sx={{ color: "gray", mt: 2 }}>
              Parece que todavía no tienes ninguna mascota creada.
            </Typography>
          )}
        </Box>

        <PopupCreatePetUser
          open={open}
          mascota={mascotaSeleccionada}
          setOpen={(val) => {
            setOpen(val);
            if (!val) {
              setMascotaSeleccionada(null);
              fetchMascotas();
            }
          }}
        />
      </section>
    </BasicScreen>
  );
}
