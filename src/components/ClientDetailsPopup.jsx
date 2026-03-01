import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Tabs, Tab, Typography, TextField, Button, IconButton, Stack, RadioGroup, FormControlLabel, Radio, Avatar, Grid } from '@mui/material';

/**
 * TabPanel Component: Conditional rendering logic for tab content.
 * Displays children only when the active 'value' equals the tab 'index'
 */
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ClientDetailsPopup({ open, onClose }) {
    // STATE: Active tab index controller (0: Client Details, 1: Pets)
    const [tabValue, setTabValue] = useState(0);

    // EVENT HANDLER: Updates the active tab state upon selection
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            // PaperProps: Customizes the root Paper component within the Dialog
            // Deprecated: Check for an alternative?
            PaperProps={{ sx: { borderRadius: 5, bgcolor: '#E1F5FE' } }}
        >
            {/* HEADER: Tabs Navigation Wrapper */}
            <Box sx={{ borderBottom: 2, borderColor: 'black', bgcolor: '#E1F5FE', pt: 1 }}>
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
                            borderRadius: '10px 10px 0 0',
                            mr: 0.5,
                            border: '1px solid black',
                            borderBottom: 'none',
                            minHeight: 40,
                            bgcolor: '#f5f5f5' // Inactive tab color
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

            <DialogContent sx={{ bgcolor: '#E1F5FE', minHeight: 400 }}>

                {/* TAB 1: CLIENT DATA FORM */}
                <TabPanel value={tabValue} index={0}>
                    <Stack spacing={2.5}>

                        {/* Name field */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ width: 180, fontWeight: 'bold' }}>Nombre</Typography>
                            <TextField fullWidth size="small" variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{ bgcolor: '#757575', borderRadius: 4, px: 2, input: { color: 'white' } }}
                            />
                        </Box>

                        {/* E-mail field */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ width: 180, fontWeight: 'bold' }}>Correo electrónico</Typography>
                            <TextField fullWidth size="small" variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{ bgcolor: '#757575', borderRadius: 4, px: 2, input: { color: 'white' } }}
                            />
                        </Box>

                        {/* Telephone number */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ width: 180, fontWeight: 'bold' }}>Número de teléfono</Typography>
                            <TextField fullWidth size="small" variant="standard"
                                placeholder="+34"
                                InputProps={{ disableUnderline: true }}
                                sx={{ bgcolor: '#757575', borderRadius: 4, px: 2, input: { color: 'white' } }}
                            />
                        </Box>

                        {/* Radio Selection: Associated Client */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 1 }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Cliente asociado a usuario</Typography>
                            <RadioGroup row defaultValue="no">
                                <FormControlLabel value="si" control={<Radio color="default" />} label="Si" />
                                <FormControlLabel value="no" control={<Radio color="cyan" />} label="No" />
                            </RadioGroup>
                        </Box>

                        {/* Send association email button */}
                        <Button variant="contained"
                            sx={{ bgcolor: '#66BB6A', color: 'black', borderRadius: 5, width: 'fit-content', textTransform: 'none', fontWeight: 'bold' }}>
                            ENVIAR CORREO DE ASOCIACIÓN
                        </Button>
                    </Stack>
                </TabPanel>

                {/* TAB 2: PET LIST */}
                <TabPanel value={tabValue} index={1}>

                    {/* Top center button (Add pet) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Button variant="contained" sx={{ bgcolor: '#A5D6A7', color: 'black', borderRadius: 5, textTransform: 'none', px: 4, fontWeight: 'bold' }}>
                            AÑADIR MASCOTA
                        </Button>
                    </Box>

                    {/* SCROLLABLE CONTAINER: Important for handling multiple pets */}
                    <Box sx={{
                        maxHeight: 320,
                        overflowY: 'auto',
                        pr: 1,
                        // Scrollbar styles (optional for aesthetics)
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#9E9E9E', borderRadius: 10 }
                    }}>

                        {/* ¡¡¡ TENGO QUE RETOCAR LOS ESTILOS Y COLORES UN POCO !!! */}
                        {/* Example mapping: Simulates multiple pets */}
                        {/* ¡¡¡ MODIFY USING REAL DATA !!! */}
                        {[1, 2, 3].map((num) => (
                            <Box key={num} sx={{ bgcolor: '#BDBDBD', borderRadius: 4, p: 2, mb: 2, border: '1px solid #9E9E9E' }}>
                                <Grid container spacing={2} alignItems="center">

                                    {/* Pet image */}
                                    <Grid item xs={2}>
                                        <Avatar variant="rounded" sx={{ width: 80, height: 80, borderRadius: 3, bgcolor: 'white', border: '1px solid black' }} />
                                    </Grid>

                                    {/* Pet data */}
                                    <Grid item xs={3}>
                                        <Typography variant="body2"><strong>Mascota 1:</strong> Mojito</Typography>
                                        <Typography variant="body2"><strong>Animal / raza:</strong> Loro</Typography>
                                        <Typography variant="body2"><strong>Chip / DNI:</strong> 999999</Typography>
                                    </Grid>

                                    {/* Vet notes */}
                                    <Grid item xs={3.5}>
                                        <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 1, height: 80 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Notas del centro vet:</Typography>
                                        </Box>
                                    </Grid>

                                    {/* Client notes */}
                                    <Grid item xs={3.5}>
                                        <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 1, height: 80 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Notas del usuario:</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                </TabPanel>
            </DialogContent>

            {/* FOOTER: Global Modal Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3, bgcolor: '#E1F5FE' }}>

                {/* Botón de salir */}
                <Button onClick={onClose} variant="contained"
                    sx={{ bgcolor: '#9E9E9E', color: 'black', borderRadius: 5, px: 4, fontWeight: 'bold' }}>
                    SALIR
                </Button>

                {/* Botón de guardar */}
                <Button variant="contained"
                    sx={{ bgcolor: '#FFCA28', color: 'black', borderRadius: 5, px: 4, fontWeight: 'bold' }}>
                    GUARDAR
                </Button>
            </Box>
        </Dialog>
    );
}