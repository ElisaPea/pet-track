import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";
import {
  acceptAssociation,
  rejectAssociationRequest,
} from "../api/createAssociationReq";
import { supabase } from "../api/supabaseClient";

interface AssociationRequestPopupProps {
  open: boolean;
  onClose: () => void;
  requests: any[];
  onRefresh: () => void;
}

type UserRole = "professional" | "user";

const configToFilter: Record<UserRole, { key: string; emailSender: string }> = {
  professional: { key: "veterinaryCenterId", emailSender: "useremail" },
  user: { key: "id", emailSender: "vetcenteremail" },
};

export default function AssociationRequestPopup({
  open,
  onClose,
  requests,
  onRefresh,
}: AssociationRequestPopupProps) {
  const { userState } = useAuth();
  const [vetNames, setVetNames] = useState<Record<string, string>>({});

  const role = userState?.role as UserRole;
  // Si userState no ha cargado aún, evitamos el crash
  if (!role) return null;

  const { key, emailSender } = configToFilter[role];

  const receivedRequests = requests.filter(
    (req) => req.senderid !== userState?.[key],
  );

  // Lógica para obtener nombres de Centros Veterinarios si soy Usuario
  useEffect(() => {
    const fetchVetNames = async () => {
      if (role !== "user" || receivedRequests.length === 0) return;

      // Extraemos IDs únicos de los centros que enviaron las peticiones
      const vetIds = [...new Set(receivedRequests.map((req) => req.senderid))];

      const { data, error } = await supabase
        .from("VeterinaryCenter")
        .select("id, name")
        .in("id", vetIds);

      if (!error && data) {
        const namesMap = data.reduce((acc: any, curr: any) => {
          acc[curr.id] = curr.name;
          return acc;
        }, {});
        setVetNames(namesMap);
      }
    };

    if (open) fetchVetNames();
  }, [open, role, requests]);

  if (receivedRequests.length === 0) return null;

  const handleAccept = async (req: any) => {
    try {
      await acceptAssociation(
        req,
        userState.id,
        role === "professional" ? userState.veterinaryCenterId : undefined,
      );
      onRefresh();
    } catch (error) {
      alert("Error al aceptar");
    }
  };

  const handleReject = async (reqId: string) => {
    try {
      await rejectAssociationRequest(reqId);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 8,
          bgcolor: "#00ADBA",
          padding: 1,
          maxWidth: 500,
          width: "100%",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "white",
          zIndex: 10,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ mt: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            mb: 3,
          }}
        >
          Solicitudes Recibidas
        </Typography>

        <Stack spacing={2} sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
          {receivedRequests.map((req) => (
            <Box
              key={req.id}
              sx={{
                bgcolor: "white",
                borderRadius: 5,
                p: 2,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#B2EBF2", color: "#00ADBA" }}>
                  {req.senderrole === "user" ? (
                    <PersonIcon />
                  ) : (
                    <BusinessIcon />
                  )}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {/* Si soy usuario, muestro el nombre del centro veterinario (si se cargó) */}
                    {role === "user" && vetNames[req.senderid]
                      ? vetNames[req.senderid].toUpperCase()
                      : req.senderrole === "user"
                        ? "Usuario Particular"
                        : "Centro Veterinario"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#00ADBA",
                      fontWeight: "500",
                      wordBreak: "break-all",
                    }}
                  >
                    {req[emailSender]}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => handleAccept(req)}
                  sx={{
                    bgcolor: "#66BB6A",
                    color: "white",
                    borderRadius: 10,
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#4CAF50" },
                  }}
                >
                  ACEPTAR
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => handleReject(req.id)}
                  sx={{
                    bgcolor: "#FF8A80",
                    color: "white",
                    borderRadius: 10,
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#D32F2F" },
                  }}
                >
                  RECHAZAR
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
