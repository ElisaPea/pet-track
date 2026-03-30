import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, Box, Stack,
    Radio, RadioGroup, FormControlLabel, FormControl,
    Divider
} from '@mui/material';

// --- Types & Interfaces ---
interface AddClientPopupProps {
    open: boolean;
    onClose: () => void;
}

const AddClientPopup = ({ open, onClose }: AddClientPopupProps) => {
    // --- State Management ---
    // Controls the "Associated to user" radio selection. Default is "no".
    const [associated, setAssociated] = useState<string>("no");

    // --- Styling Constants ---
    // Centralized styles for the dark-gray inputs to ensure consistency
    const grayInputStyle = {
        bgcolor: 'white',
        borderRadius: 4,
        px: 2,
        input: {
            color: 'black',
            '&::placeholder': { color: '#BDBDBD', opacity: 1 }
        }
    };

    // --- Handlers ---
    const handleSave = () => {
        alert("Saved successfully!"); // Placeholder for future API call
        onClose();
    };

    const handleExit = () => {
        alert("Exited without saving");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            // --- Backdrop Blur Effect ---
            // This targets the background layer specifically
            slotProps={{
                backdrop: {
                    sx: {
                        // Background color with low opacity
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        // Standard blur and safari support
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    },
                },
            }}
            // Using PaperProps to style the dialog container itself
            PaperProps={{
                sx: { borderRadius: 5, bgcolor: '#E1F5FE', p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.5rem' }}>
                Agregar nuevo cliente
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {/* --- Input Fields Section --- 
                        If you need to add more fields (e.g., Address), 
                        just add a new object to this array.
                    */}
                    {[
                        { label: "Nombre", type: "text", placeholder: "Nombre completo ..." },
                        { label: "DNI", type: "text", placeholder: "DNI ..." },
                        { label: "Email", type: "email", placeholder: "ejemplo@mail.com ..." },
                        { label: "Teléfono", type: "tel", placeholder: "600 000 000 ..." }
                    ].map((field) => (
                        <Box
                            key={field.label}
                            sx={{
                                display: 'flex',
                                justifyContent: { xs: 'flex-start', sm: 'space-between' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 0.5, sm: 0 },
                                width: '100%'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    minWidth: '120px',
                                    textAlign: 'left',
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                {field.label}
                            </Typography>
                            <TextField
                                size="small"
                                variant="standard"
                                placeholder={field.placeholder}
                                InputProps={{ disableUnderline: true }}
                                sx={{ ...grayInputStyle, width: { xs: '100%', sm: 300 } }}
                            />
                        </Box>
                    ))}

                    <Divider sx={{ my: 1, opacity: 0.5 }} />

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
                        Target for future modification: Add the email sending logic here.
                    */}
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
            </DialogContent>

            {/* --- Action Buttons --- */}
            {/* --- SALIR Button --- */}
            <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    onClick={handleExit}
                    sx={{
                        bgcolor: '#F02F0A',
                        borderRadius: 10,
                        px: 5,
                        color: 'black',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#D82E0C' }
                    }}
                >
                    SALIR
                </Button>

                {/* --- GUARDAR button --- */}
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        bgcolor: '#FFCA28',
                        borderRadius: 10,
                        px: 5,
                        color: 'black',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#f9a825' }
                    }}
                >
                    GUARDAR
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientPopup;