import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, Box, Stack,
    Radio, RadioGroup, FormControlLabel, FormControl,
    Divider,
    Alert,
    Collapse
} from '@mui/material';
import { createVetClient } from '../api/query';
import { validateEmail, validatePhone } from '../utils/validationUtils';
import { validateName } from '../utils/validatorName';

// --- Types & Interfaces ---
interface AddClientPopupProps {
    open: boolean;
    onClose: () => void;
}

const AddClientPopup = ({ open, onClose }: AddClientPopupProps) => {
    // --- State Management ---
    // Controls the "Associated to user" radio selection. Default is "no".
    const [associated, setAssociated] = useState<string>("no");

    // State for empty required fields
    const [error, setError] = useState(false);

    // 3 distinct states to control format errors
    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);

    // State for database error
    const [dbError, setDbError] = useState(false);

    // State for success
    const [success, setSuccess] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        Nombre: '',
        Email: '',
        Teléfono: ''
    });

    // Handler for changes in the inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(false); // Clear empty error

        // Clear individual errors while typing
        if (e.target.name === 'Nombre' && errorName) setErrorName(false);
        if (e.target.name === 'Email' && errorEmail) setErrorEmail(false);
        if (e.target.name === 'Teléfono' && errorPhone) setErrorPhone(false);

        if (dbError) setDbError(false);

        // Hide success if the user types again
        if (success) setSuccess(false);
    };

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
    const handleSave = async () => {
        const { Nombre, Email, Teléfono } = formData;

        setError(false);
        setErrorName(false);
        setErrorEmail(false);
        setErrorPhone(false);
        setDbError(false);
        setSuccess(false);

        if (!Nombre.trim() || !Email.trim() || !Teléfono.trim()) {
            setError(true);
            return;
        }

        const isNameValid = validateName(Nombre);
        const isEmailValid = validateEmail(Email);
        const isPhoneValid = validatePhone(Teléfono);

        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            if (!isNameValid) setErrorName(true);
            if (!isEmailValid) setErrorEmail(true);
            if (!isPhoneValid) setErrorPhone(true);
            return;
        }

        try {
            await createVetClient({
                name: Nombre,
                email: Email,
                phone: Teléfono,
                // If the radio button is "no", we send null. 
                // For now, if it's "yes" we'll also send null 
                // but we already leave this logic prepared.
                userid: associated === "no" ? null : null
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ Nombre: '', Email: '', Teléfono: '' });
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setDbError(true);
        }
    };

    const handleExit = () => {
        // Clear forms and error states
        setFormData({ Nombre: '', Email: '', Teléfono: '' });
        setError(false);
        setErrorName(false);
        setErrorEmail(false);
        setErrorPhone(false);
        setDbError(false);
        setSuccess(false);

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

                {/* Database Error Message */}
                <Collapse in={dbError}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 5 }}>
                        Ocurrió un error al intentar guardar en la base de datos.
                    </Alert>
                </Collapse>

                {/* Success Message */}
                <Collapse in={success}>
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 5 }}>
                        ¡Datos guardados correctamente!
                    </Alert>
                </Collapse>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {/* --- Input Fields Section --- 
                        If we need to add more fields,
                        just add a new object to this array.
                    */}
                    {[
                        { label: "Nombre", fieldKey: "Nombre", type: "text", placeholder: "Nombre completo ..." },
                        { label: "Email", fieldKey: "Email", type: "email", placeholder: "ejemplo@mail.com ..." },
                        { label: "Teléfono", fieldKey: "Teléfono", type: "tel", placeholder: "600 000 000 ..." }
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
                                value={formData[field.fieldKey as keyof typeof formData]}
                                name={field.fieldKey}
                                onChange={handleChange}
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