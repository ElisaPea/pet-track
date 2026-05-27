import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AccountSettingsUser from "../pages/AccountSettingsUser";

// Mock de la navegación
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock del contexto de autenticación
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    userState: {
      id: "test-user-id",
      name: "Test User",
      email: "test@email.com",
      phone: "600123456",
      address: "Test Address",
    },
    updateAuth: vi.fn(),
  }),
}));

// Mock del contexto de asociación (usado por el NavBar)
vi.mock("../context/AssociationContext", () => ({
  useAssociation: () => ({
    pendingRequests: [],
    acceptedRequests: [],
    refreshAssociations: vi.fn(),
  }),
}));

// Mock de las llamadas a la API
vi.mock("../api/query", () => ({
  updateUserProfile: vi.fn().mockResolvedValue({}),
}));

describe("Pruebas Unitarias - Validación de Teléfono en Perfil", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <AccountSettingsUser />
      </BrowserRouter>
    );
  };

  it("debe mostrar error si el nombre está vacío", async () => {
    setup();
    const nameInput = screen.getByLabelText(/Nombre\*/i);
    const saveButton = screen.getByRole("button", { name: /GUARDAR/i });

    // Limpiamos el nombre
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(saveButton);

    const alert = await screen.findByText(/Campos requeridos faltantes: Nombre/i);
    expect(alert).toBeInTheDocument();
  });

  it("debe mostrar error de formato si el teléfono tiene menos de 4 dígitos", async () => {
    setup();
    const phoneInput = screen.getByLabelText(/Número de teléfono:/i);
    const saveButton = screen.getByRole("button", { name: /GUARDAR/i });

    // Cambiamos a un teléfono muy corto (3 dígitos)
    fireEvent.change(phoneInput, { target: { value: "123" } });
    fireEvent.click(saveButton);

    const alert = await screen.findByText(/Formato incorrecto en: Número de teléfono/i);
    expect(alert).toBeInTheDocument();
  });

  it("debe mostrar error de formato si el teléfono tiene más de 15 dígitos", async () => {
    setup();
    const phoneInput = screen.getByLabelText(/Número de teléfono:/i);
    const saveButton = screen.getByRole("button", { name: /GUARDAR/i });

    // Cambiamos a un teléfono muy largo (16 dígitos)
    fireEvent.change(phoneInput, { target: { value: "1234567890123456" } });
    fireEvent.click(saveButton);

    const alert = await screen.findByText(/Formato incorrecto en: Número de teléfono/i);
    expect(alert).toBeInTheDocument();
  });

  it("debe mostrar éxito si el teléfono es correcto (entre 4 y 15 dígitos)", async () => {
    setup();
    const phoneInput = screen.getByLabelText(/Número de teléfono:/i);
    const saveButton = screen.getByRole("button", { name: /GUARDAR/i });

    // Cambiamos a un teléfono válido de 9 dígitos
    fireEvent.change(phoneInput, { target: { value: "600123456" } });
    
    // Forzamos que se active el botón simulando un cambio
    fireEvent.click(saveButton);

    await waitFor(async () => {
      const alert = await screen.findByText(/¡Datos guardados exitosamente!/i);
      expect(alert).toBeInTheDocument();
    });
  });
});