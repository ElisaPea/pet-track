import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";
import { SCREEN } from "../constants/constants";

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: string;
}) {
  const { userAuthenticated, role, loading } = useAuth();

  // 1. Si está cargando la sesión inicial de Supabase
  if (loading) return <p>Cargando sesión...</p>;

  // 2. Si no hay usuario en absoluto
  if (!userAuthenticated) return <Navigate to={SCREEN.LOGIN} />;

  // 3. CAMBIO CLAVE: Si hay usuario pero el rol aún no ha llegado de la DB
  // No bloquees todavía, espera a que el rol deje de ser null
  if (requiredRole && role === null) {
    return <p>Verificando permisos...</p>;
  }

  // 4. Ahora sí, si el rol llegó y no es el correcto
  if (requiredRole && role !== requiredRole) {
    console.log(
      "Acceso denegado. Rol actual:",
      role,
      "Requerido:",
      requiredRole,
    );
    return <Navigate to={SCREEN.LANDING_PAGE} />; // O a una página de error
  }

  return children;
}

// Uso en App.tsx:
// <Route path="/vet-panel" element={<ProtectedRoute requiredRole="professional"><VetPanel /></ProtectedRoute>} />
