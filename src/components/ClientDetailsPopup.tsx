import React, { useState } from 'react';
// Importamos Grid que faltaba en tu lista anterior
import {
    Dialog,
    DialogContent,
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
    Grid
} from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Interface for the primary Modal/Popup component props
interface ClientDetailsPopupProps {
    open: boolean;
    onClose: () => void;
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
const ClientDetailsPopup: React.FC<ClientDetailsPopupProps> = ({ open, onClose }) => {
    // STATE: Active tab index controller (0: Client Details, 1: Pets)
    const [tabValue, setTabValue] = useState(0);

    // EVENT HANDLER: Updates the active tab state upon selection
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            // PaperProps: UI Customization: Background colors and border radius configuration
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    bgcolor: '#E1F5FE',
                    margin: { xs: 2, sm: 'auto' }, // Margen pequeño en móviles
                    width: {
                        xs: '95%',
                        sm: '800px',
                        md: '900px'
                    } // Se estira en móvil
                }
            }}
        >
            {/* HEADER: Tabs Navigation Wrapper */}
            <Box sx={{ borderBottom: 2, borderColor: 'black', bgcolor: '#E1F5FE', pt: 0, mt: 0 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    TabIndicatorProps={{ sx: { display: 'none' } }}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: 'black',
                            minHeight: 50, // Margin between the tab and the tab content
                            bgcolor: '#E1F5FE', // Inactive tab color
                        },
                        '& .Mui-selected': {
                            bgcolor: '#00ADBA !important', // Turquoise color for active tab
                            color: 'black !important',
                        }
                    }}
                >
                    <Tab label="Datos cliente" />
                    <Tab label="Mascotas" />
                </Tabs>
            </Box>

            <DialogContent sx={{ bgcolor: '#E1F5FE', minHeight: 400, px: { xs: 1, sm: 3 } }}>

                {/* TAB 1: CLIENT DATA FORM */}
                <TabPanel value={tabValue} index={0}>
                    <Stack spacing={2.5} sx={{ maxWidth: 600, mx: 'auto' }}>
                        {/* Name field */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 2 },
                            width: '100%'
                        }}>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                Nombre
                            </Typography>
                            <TextField size="small" variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{ bgcolor: '#757575', borderRadius: 4, px: 2, width: { xs: '100%', sm: 350 }, input: { color: 'white' } }}
                            />
                        </Box>

                        {/* E-mail field */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 2 },
                            width: '100%'
                        }}>
                            <Typography sx={{ width: 180, fontWeight: 'bold' }}>
                                Correo electrónico
                            </Typography>
                            <TextField fullWidth size="small" variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{ bgcolor: '#757575', borderRadius: 4, px: 2, width: { xs: '100%', sm: 350 }, input: { color: 'white' } }}
                            />
                        </Box>

                        {/* Telephone number */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 2 },
                            width: '100%'
                        }}>
                            <Typography sx={{ width: 180, fontWeight: 'bold' }}>
                                Teléfono
                            </Typography>
                            <TextField fullWidth size="small" variant="standard"
                                placeholder="+34"
                                InputProps={{ disableUnderline: true }}
                                sx={{ bgcolor: '#757575', borderRadius: 4, px: 2, width: { xs: '100%', sm: 150 }, input: { color: 'white' } }}
                            />
                        </Box>

                        {/* Radio Selection: Associated Client */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 1 }}>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                Cliente asociado a usuario
                            </Typography>
                            <RadioGroup row defaultValue="no">
                                <FormControlLabel value="si" control={<Radio sx={{ '&.Mui-checked': { color: '#00ADBA' } }} />} label="Si" />
                                <FormControlLabel value="no" control={<Radio sx={{ '&.Mui-checked': { color: '#00ADBA' } }} />} label="No" />
                            </RadioGroup>
                        </Box>

                        {/* Send association email button */}
                        <Button variant="contained"
                            sx={{ bgcolor: '#66BB6A', color: 'black', borderRadius: 5, width: 'fit-content', textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#52a552ff' } }}>
                            ENVIAR CORREO DE ASOCIACIÓN
                        </Button>
                    </Stack>
                </TabPanel>

                {/* TAB 2: PET LIST */}
                <TabPanel value={tabValue} index={1}>

                    {/* Top center button (Add pet) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Button variant="contained" sx={{ bgcolor: '#66BB6A', color: 'black', borderRadius: 5, textTransform: 'none', px: 4, fontWeight: 'bold', '&:hover': { bgcolor: '#52a552ff' } }}>
                            AÑADIR MASCOTA
                        </Button>
                    </Box>

                    {/* SCROLLABLE CONTAINER: Important for handling multiple pets */}
                    <Box sx={{
                        maxHeight: 450,
                        overflowY: 'auto',
                        pr: 2,
                        '&::-webkit-scrollbar': { width: '10px' }, // Scrollbar width
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#00ADBA', borderRadius: 10 } // Scrollbar thumb color and border radius
                    }}>
                        {/* Simulación de mapeo dinámico */}
                        {[1, 2, 3, 4, 5].map((num) => (
                            <Box key={num} sx={{
                                bgcolor: '#00ADBA', // Tu color turquesa de la imagen
                                borderRadius: 8,
                                p: 2,
                                mb: 2,
                                display: 'flex',
                                // En móvil (xs) apilamos, en PC (sm) fila horizontal
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center',
                                gap: 2
                            }}>
                                {/* LEFT GROUP: Pet profile pic and data */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    minWidth: { sm: '250px' }, // Reservamos espacio para foto + texto
                                    width: { xs: '100%', sm: 'auto' },
                                    justifyContent: { xs: 'center', sm: 'flex-start' }
                                }}>
                                    {/* Pet profile pic */}
                                    <Avatar variant="rounded" sx={{ width: 80, height: 80, borderRadius: 3, bgcolor: 'white', border: '1px solid black' }} />

                                    {/* Pet data */}
                                    <Box sx={{ color: 'black', textAlign: 'left' }}>
                                        <Typography variant="body2">
                                            Nombre: Mojito
                                        </Typography>
                                        <Typography variant="body2">
                                            Especie: Loro
                                        </Typography>
                                        <Typography variant="body2">
                                            Chip: 999999
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* RIGHT GROUP: Veterinary and user notes */}
                                <Box sx={{
                                    display: 'flex',
                                    flexGrow: 1,
                                    gap: 2,
                                    width: '100%',
                                    flexDirection: { xs: 'column', sm: 'row' }
                                }}>
                                    {/* Veterinary notes */}
                                    <Box sx={{
                                        flex: 1,
                                        bgcolor: 'white',
                                        borderRadius: 4,
                                        border: '1px solid black',
                                        p: 0,
                                        minHeight: 80,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                            Notas del centro vet:
                                        </Typography>
                                    </Box>

                                    {/* User notes */}
                                    <Box sx={{
                                        flex: 1,
                                        bgcolor: 'white',
                                        borderRadius: 4,
                                        border: '1px solid black',
                                        p: 0,
                                        minHeight: 80,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                            Notas del usuario:
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </TabPanel>
            </DialogContent>

            {/* FOOTER: Global Modal Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3, bgcolor: '#E1F5FE' }}>
                <Button onClick={onClose} variant="contained"
                    sx={{ bgcolor: '#F02F0A', color: 'black', borderRadius: 5, px: 4, fontWeight: 'bold', '&:hover': { bgcolor: '#D82E0C' } }}>
                    SALIR
                </Button>
                <Button variant="contained"
                    sx={{ bgcolor: '#FFCA28', color: 'black', borderRadius: 5, px: 4, fontWeight: 'bold', '&:hover': { bgcolor: '#f9a825' } }}>
                    GUARDAR
                </Button>
            </Box>
        </Dialog>
    );
};

export default ClientDetailsPopup;