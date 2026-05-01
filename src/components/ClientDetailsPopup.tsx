import React, { useState, useEffect } from "react";
// Importamos Grid que faltaba en tu lista anterior
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  FormControl,
  Collapse,
  Alert,
} from "@mui/material";
import { updateClientProfile, createPetForClient } from "../api/query";
import { validateEmail, validatePhone } from "../utils/validationUtils";
import { validateName } from "../utils/validatorName";

// Pictures import for testing (TO DELETE)
// import beni from "../assets/Beni_perfil.jpeg";
// import test1 from "../assets/test_1.jpg";
// import test2 from "../assets/test_2.jpeg";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Interface for the primary Modal/Popup component props
interface ClientDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  clientData: any | null; // Objeto del cliente completo (incluye mascotas) desde HomeVet
}

/**
 * TabPanel Component: Conditional rendering logic for tab content.
 * Displays children only when the active 'value' equals the tab 'index'
 */
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * PRIMARY COMPONENT: ClientDetailsPopup
 * Implements React.FC with ClientDetailsPopupProps interface
 */
const ClientDetailsPopup: React.FC<ClientDetailsPopupProps> = ({
  open,
  onClose,
  clientData,
}) => {
  // STATE: Active tab index controller (0: Client Details, 1: Pets)
  const [tabValue, setTabValue] = useState(0);

  // --- State Management ---
  // Controls the "Associated to user" radio selection. Default is "no".
  const [associated, setAssociated] = useState<string>("no");

  // State for empty required fields
  const [error, setError] = useState(false);

  // 3 distinct states to control format errors
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);

  // States for Add Pet Popup
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [newPetData, setNewPetData] = useState({
    name: "",
    species: "",
    breed: "",
    birthdate: ""
  });
  const [addPetError, setAddPetError] = useState(false);

  // Form inputs state para detectar cambios
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Handler for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(false); // Clear empty error

    // Clear individual errors while typing
    if (e.target.name === 'name' && errorName) setErrorName(false);
    if (e.target.name === 'email' && errorEmail) setErrorEmail(false);
    if (e.target.name === 'phone' && errorPhone) setErrorPhone(false);
  };

  // EVENT HANDLER: Updates the active tab state upon selection
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // EVENT HANDLER: Reinicia los datos si el usuario cancela y cierra el PopUp
  const handleExit = () => {
    if (clientData) {
      setAssociated(clientData.userid ? "si" : "no");
      setFormData({
        name: clientData.name || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
      });
    }
    setError(false);
    setErrorName(false);
    setErrorEmail(false);
    setErrorPhone(false);
    setTabValue(0); // Opcional, devolver el Focus a la primera pestaña
    onClose();
  };

  // EVENT HANDLER: Guarda los cambios en la base de datos
  const handleSave = async () => {
    if (!clientData || !clientData.id) return;

    setError(false);
    setErrorName(false);
    setErrorEmail(false);
    setErrorPhone(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setError(true);
        return;
    }

    const isNameValid = validateName(formData.name);
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
        if (!isNameValid) setErrorName(true);
        if (!isEmailValid) setErrorEmail(true);
        if (!isPhoneValid) setErrorPhone(true);
        return;
    }

    try {
      // Preparamos el payload a enviar basado en el formData actual
      // Importante: userid podría ir también si integramos el login (temporalmente "si" no manda nada válido)
      await updateClientProfile(clientData.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        // userid: associated === "si" ? ... (Pendiente lógica auth)
      });
      
      // Forzar un reload rápido de la página para que HomeVet actualice las tarjetas con la nueva BBDD 
      // (En el futuro se puede sustituir por un prop "onSaveSuccess" para refrescar el estado de React)
      window.location.reload();
    } catch (error) {
      console.error("No se ha podido actualizar el cliente:", error);
      alert("Hubo un error al intentar actualizar el cliente.");
    }
  };

  // EVENT HANDLER: Añade una nueva mascota y la vincula al cliente
  const handleAddPet = async () => {
    if (!newPetData.name.trim()) {
      setAddPetError(true);
      return;
    }

    try {
      // Usamos única y exclusivamente el ID del cliente
      const clientId = clientData.id;
      
      await createPetForClient(newPetData, clientId);
      
      setIsAddPetOpen(false);
      setNewPetData({ name: "", species: "", breed: "", birthdate: "" });
      setAddPetError(false);
      
      // Forzamos la recarga igual que en handleSave para actualizar la lista de mascotas
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      alert("Hubo un error al intentar crear la mascota.");
    }
  };

  // 1. Configuramos el estado inicial una vez que se recibe clientData
  useEffect(() => {
    if (clientData) {
      setAssociated(clientData.userid ? "si" : "no");
      setFormData({
        name: clientData.name || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
      });
    }
  }, [clientData]);

  // Computed state para habilitar o deshabilitar botóon Guardar
  // Compara si el texto actual es distinto al que traía clientData.
  const isFormModified = clientData ? (
    formData.name.trim() !== (clientData.name || "").trim() ||
    formData.email.trim() !== (clientData.email || "").trim() ||
    formData.phone.trim() !== (clientData.phone || "").trim() ||
    associated !== (clientData.userid ? "si" : "no")
  ) : false;

  return (
    <Dialog
      open={open}
      onClose={handleExit}
      fullWidth
      maxWidth="md"
      // Customize the popup background effect
      slotProps={{
        backdrop: {
          sx: {
            // Pop Up background color transparent
            backgroundColor: "transparent",
            // Blur effect
            backdropFilter: "blur(2px)",
          },
        },
      }}
      // PaperProps: UI Customization: Background colors and border radius configuration
      PaperProps={{
        sx: {
          borderRadius: 5,
          bgcolor: "#E1F5FE",
          margin: { xs: 2, sm: "auto" },
          width: {
            xs: "95%",
            sm: "800px",
            md: "900px",
          },
        },
      }}
    >
      {/* HEADER: Tabs Navigation Wrapper */}
      <Box
        sx={{
          borderBottom: 2,
          borderColor: "black",
          bgcolor: "#E1F5FE",
          pt: 0,
          mt: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "black",
              minHeight: 50, // Margin between the tab and the tab content
              bgcolor: "#E1F5FE", // Inactive tab color
            },
            "& .Mui-selected": {
              bgcolor: "#00ADBA !important", // Turquoise color for active tab
              color: "black !important",
            },
          }}
        >
          <Tab label="Datos cliente" />
          <Tab label="Mascotas" />
        </Tabs>
      </Box>

      <DialogContent
        sx={{ bgcolor: "#E1F5FE", minHeight: 400, px: { xs: 1, sm: 3 } }}
      >
        {/* TAB 1: CLIENT DATA FORM */}
        <TabPanel value={tabValue} index={0}>
          {/* Visual Error Message Fill in required fields */}
          <Collapse in={error}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                  Por favor, rellena todos los campos obligatorios (Nombre, Email
                  y Teléfono).
              </Alert>
          </Collapse>

          {/* Visual Error Message Specific format */}
          <Collapse in={errorName || errorEmail || errorPhone}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                  Por favor, corrige el formato de los siguientes campos: {[
                      errorName && 'Nombre',
                      errorEmail && 'Email',
                      errorPhone && 'Teléfono'
                  ].filter(Boolean).join(', ')}.
              </Alert>
          </Collapse>

          <Stack spacing={2.5} sx={{ maxWidth: 600, mx: "auto" }}>

            {/* Name field */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Nombre</Typography>
              <TextField
                key={`name-${clientData?.id || "empty"}`}
                name="name"
                size="small"
                variant="standard"
                value={formData.name}
                onChange={handleChange}
                InputProps={{ disableUnderline: true }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 50,
                  px: 2,
                  py: 0.5,
                  width: { xs: "100%", sm: 350 },
                }}
              />
            </Box>

            {/* E-mail field */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
                width: "100%",
              }}
            >
              <Typography sx={{ width: 180, fontWeight: "bold" }}>
                Correo electrónico
              </Typography>
              <TextField
                fullWidth
                key={`email-${clientData?.id || "empty"}`}
                name="email"
                size="small"
                variant="standard"
                value={formData.email}
                onChange={handleChange}
                InputProps={{ disableUnderline: true }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 50,
                  px: 2,
                  py: 0.5,
                  width: { xs: "100%", sm: 350 },
                }}
              />
            </Box>

            {/* Telephone number */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 1, sm: 2 },
                width: "100%",
              }}
            >
              <Typography sx={{ width: 180, fontWeight: "bold" }}>
                Teléfono
              </Typography>
              <TextField
                fullWidth
                key={`phone-${clientData?.id || "empty"}`}
                name="phone"
                size="small"
                variant="standard"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34"
                InputProps={{ disableUnderline: true }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 50,
                  px: 2,
                  py: 0.5,
                  width: { xs: "100%", sm: 150 },
                }}
              />
            </Box>

            {/* Radio Selection: Associated Client */}
            {/* --- Association Logic Section --- */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>
                El cliente está asociado a un usuario?
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={associated}
                  onChange={(e) => setAssociated(e.target.value)}
                >
                  <FormControlLabel value="si" control={<Radio size="small" />} label="Si" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Box>
            {/* Logic: This button remains disabled unless "Yes" is selected.
                Target for future modification: Add the email sending logic here. */}
            <Button
              variant="contained"
              disabled={associated === "no"}
              sx={{
                bgcolor: '#66BB6A',
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1,
                '&:hover': { bgcolor: '#52a552ff' },
                // Custom style for disabled state to maintain UI clarity
                '&.Mui-disabled': { bgcolor: '#BDBDBD', color: '#F5F5F5' }
              }}
            >
              Enviar correo de asociación
            </Button>
          </Stack>
        </TabPanel>

        {/* TAB 2: PET LIST */}
        <TabPanel value={tabValue} index={1}>
          {/* Top center button (Add pet) */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => setIsAddPetOpen(true)}
              sx={{
                bgcolor: "#66BB6A",
                color: "black",
                borderRadius: 5,
                textTransform: "none",
                px: 4,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#52a552ff" },
              }}
            >
              AÑADIR MASCOTA
            </Button>
          </Box>

          {/* SCROLLABLE CONTAINER: Important for handling multiple pets */}
          <Box
            sx={{
              maxHeight: 450,
              overflowY: "auto",
              pr: 2,
              "&::-webkit-scrollbar": { width: "10px" }, // Scrollbar width
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#00ADBA",
                borderRadius: 10,
              }, // Scrollbar thumb color and border radius
            }}
          >
            {/* Mapeo dinámico y real de las mascotas del cliente */}
            {clientData?.pets && clientData.pets.length > 0 ? (
              clientData.pets.map((pet: any, index: number) => (
              <Box
                key={pet.id || index}
                sx={{
                  bgcolor: "#00ADBA",
                  borderRadius: 8,
                  p: 2,
                  mb: 2,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* LEFT GROUP: Pet profile pic and data */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: { sm: "250px" },
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  {/* Pet profile pic */}
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      bgcolor: "white",
                      border: "1px solid black",
                    }}
                  >
                    {pet.name.charAt(0).toUpperCase()}
                  </Avatar>

                  {/* Pet data */}
                  <Box sx={{ color: "black", textAlign: "left" }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Nombre: {pet.name}</Typography>
                    <Typography variant="body2">Especie: {pet.species || "-"}</Typography>
                    <Typography variant="body2">Raza: {pet.breed || "-"}</Typography>
                  </Box>
                </Box>

                {/* RIGHT GROUP: Veterinary and user notes */}
                {/* NOTE: replace the typography to a TextField to read-only state to prevent user input */}
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    gap: 2,
                    width: "100%",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  {/* Veterinary notes */}
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: "white",
                      borderRadius: 4,
                      border: "1px solid black",
                      p: 0,
                      minHeight: 80,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      Notas del centro vet:
                    </Typography>
                  </Box>

                  {/* User notes */}
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: "white",
                      borderRadius: 4,
                      border: "1px solid black",
                      p: 0,
                      minHeight: 80,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      Notas del usuario:
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
            ) : (
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
                 mt: 6,
                 mb: 4
               }}>
                 <Typography sx={{ fontSize: "3.5rem", lineHeight: 1 }}>🐾</Typography>
                 <Box>
                   <Typography sx={{ fontWeight: "bold", color: "#F57F17", fontSize: "1.15rem", mb: 0.5 }}>
                     ¡Vaya! Qué vacío está esto.
                   </Typography>
                   <Typography variant="body2" sx={{ color: "#FF8F00" }}>
                     Parece que este cliente todavía no ha registrado a ningún peludo en el centro.
                   </Typography>
                 </Box>
               </Box>
            )}
          </Box>
        </TabPanel>
      </DialogContent>

      {/* FOOTER: Global Modal Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          p: 3,
          bgcolor: "#E1F5FE",
        }}
      >
        <Button
          onClick={handleExit}
          variant="contained"
          sx={{
            bgcolor: "#F02F0A",
            color: "black",
            borderRadius: 5,
            px: 4,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#D82E0C" },
          }}
        >
          SALIR
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormModified}
          sx={{
            bgcolor: "#FFCA28",
            color: "black",
            borderRadius: 5,
            px: 4,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#f9a825" },
            '&.Mui-disabled': { bgcolor: '#E0E0E0', color: '#9E9E9E' }
          }}
        >
          GUARDAR
        </Button>
      </Box>

      {/* ADD PET POPUP */}
      <Dialog
        open={isAddPetOpen}
        onClose={() => {
          setIsAddPetOpen(false);
          setNewPetData({ name: "", species: "", breed: "", birthdate: "" });
          setAddPetError(false);
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 5, bgcolor: '#E1F5FE', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.25rem' }}>
          Añadir nueva mascota
        </DialogTitle>
        <DialogContent>
          <Collapse in={addPetError}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 5 }}>
              El nombre de la mascota es obligatorio.
            </Alert>
          </Collapse>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Nombre</Typography>
            <TextField
              size="small"
              variant="standard"
              placeholder="Nombre de la mascota..."
              value={newPetData.name}
              onChange={(e) => {
                setNewPetData({ ...newPetData, name: e.target.value });
                if (addPetError) setAddPetError(false);
              }}
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: 'white', borderRadius: 4, px: 2, py: 0.5 }}
            />

            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Especie</Typography>
            <TextField
              size="small"
              variant="standard"
              placeholder="Ej: Perro, Gato..."
              value={newPetData.species}
              onChange={(e) => setNewPetData({ ...newPetData, species: e.target.value })}
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: 'white', borderRadius: 4, px: 2, py: 0.5 }}
            />

            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Raza</Typography>
            <TextField
              size="small"
              variant="standard"
              placeholder="Raza..."
              value={newPetData.breed}
              onChange={(e) => setNewPetData({ ...newPetData, breed: e.target.value })}
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: 'white', borderRadius: 4, px: 2, py: 0.5 }}
            />

            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Fecha de nacimiento</Typography>
            <TextField
              type="date"
              size="small"
              variant="standard"
              value={newPetData.birthdate}
              onChange={(e) => setNewPetData({ ...newPetData, birthdate: e.target.value })}
              InputProps={{ disableUnderline: true }}
              sx={{ bgcolor: 'white', borderRadius: 4, px: 2, py: 0.5 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => {
              setIsAddPetOpen(false);
              setNewPetData({ name: "", species: "", breed: "", birthdate: "" });
              setAddPetError(false);
            }}
            sx={{
              bgcolor: '#F02F0A', color: 'black', fontWeight: 'bold', borderRadius: 10, px: 4, textTransform: 'none', '&:hover': { bgcolor: '#D82E0C' }
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleAddPet}
            variant="contained"
            sx={{
              bgcolor: '#FFCA28', color: 'black', fontWeight: 'bold', borderRadius: 10, px: 4, textTransform: 'none', '&:hover': { bgcolor: '#f9a825' }
            }}
          >
            GUARDAR
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ClientDetailsPopup;
