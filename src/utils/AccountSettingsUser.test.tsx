//Importación de utilidades de testeo y componentes necesarios para las pruebas unitarias
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AccountSettingsUser from '../pages/AccountSettingsUser';

// Mock de la navegación para evitar errores de ejecución
//Creamos una función mock para simular la navegación y evitar errores relacionados con el enrutamiento durante las pruebas unitarias. Esto nos permite centrarnos en probar la lógica de validación del teléfono sin preocuparnos por la navegación real.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Pruebas Unitarias - Validación de Teléfono', () => {
  //Renderiza el componente dentro de un Router
  const setup = () => {
    render(
      <BrowserRouter>
        <AccountSettingsUser />
      </BrowserRouter>
    );
    // Para probar el teléfono sin que salte el error de los otros campos,
    // primero rellenamos Nombre y Email válidos.
    fireEvent.change(screen.getByLabelText(/Nombre\*/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico\*/i), { target: { value: 'test@email.com' } });
  };
  //-- Escenarios de pruebas---

  it('debe mostrar error si el teléfono está vacío (solo contiene +34)', async () => {
    setup();
    const saveButton = screen.getByRole('button', { name: /GUARDAR/i });
    
    // El valor por defecto ya es "+34 ", así que solo pulsamos guardar
    fireEvent.click(saveButton);
    //Verificación: Buscamos el mensaje de error específico para campos vacíos (error 1)
    const alert = await screen.findByText(/Por favor, rellena todos los campos obligatorios/i);
    expect(alert).toBeInTheDocument();
  });

  it('debe mostrar error de formato si el teléfono no tiene 11 dígitos', async () => {
    setup();
    const phoneInput = screen.getByLabelText(/Número de teléfono\*/i);
    const saveButton = screen.getByRole('button', { name: /GUARDAR/i });

    // Introducimos un teléfono corto (ej: 8 dígitos en total con el +34)
    fireEvent.change(phoneInput, { target: { value: '+34 12345' } });
    fireEvent.click(saveButton);
    //Verificación: Buscamos el mensaje de error específico para formato incorrecto (error 2)
    const alertError2 = await screen.findByText(/Por favor, rellena con el formato adecuado los campos obligatorios/i);
    expect(alertError2).toBeInTheDocument();
  });

  it('debe mostrar éxito si el teléfono tiene exactamente 11 dígitos (+34 y 9 números)', async () => {
    setup();
    const phoneInput = screen.getByLabelText(/Número de teléfono\*/i);
    const saveButton = screen.getByRole('button', { name: /GUARDAR/i });

    // Formato correcto: +34 (2 dígitos) + 9 números = 11 dígitos totales
    fireEvent.change(phoneInput, { target: { value: '+34 600123456' } });
    fireEvent.click(saveButton);
    //Verificación: Buscamos el mensaje de éxito
    const successAlert = await screen.findByText(/¡Datos guardados correctamente!/i);
    expect(successAlert).toBeInTheDocument();
  });
});