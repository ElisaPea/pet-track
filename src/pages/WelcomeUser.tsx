import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import BasicScreen from "../components/BasicScreen";
import { PopupCreatePetUser } from "../components/PopupCreatePetUser";

export default function WelcomeUser() {
  const [open, setOpen] = useState(false);

  return (
    <BasicScreen>
      <section>
        {/* Welcome User Title & Blue Line ----*/}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Bienvenido ****
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#00ADBA",
              borderRadius: "50px",
              width: 75,
              height: 5,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
              mt: 1,
              ml: "auto",
              mr: "auto",
            }}
          ></Box>
        </Box>
        {/* Pet & Add Pet Boxes Container */}
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
          {/* Add Pet Box */}
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
          {/* Pet Box */}
          <Box
            sx={{
              bgcolor: "#00ADBA",
              borderRadius: 10,
              width: 350,
              height: 240,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                mt: 1,
                mb: 1,
                columnGap: 1.5,
                rowGap: -2,
              }}
            >
              {/* Pet Info Field */}
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 5,
                  width: 200,
                  height: 100,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                <Typography variant="h6" textAlign="center">
                  Vin
                </Typography>
                <Typography variant="body1" textAlign="left" sx={{ ml: 2 }}>
                  - Shitzu
                </Typography>
                <Typography variant="body1" textAlign="left" sx={{ ml: 2 }}>
                  - 4 años
                </Typography>
              </Box>
              {/* Pet Img Field */}
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1667411099198-a87e51e8c7b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                sx={{
                  borderRadius: 5,
                  width: 100,
                  height: 100,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                }}
              ></Box>
              {/* Pet Aditional Info Field */}
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 5,
                  width: 310,
                  height: 100,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Inserar informacion adicional
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <PopupCreatePetUser open={open} setOpen={setOpen} />
      </section>
    </BasicScreen>
  );
}
