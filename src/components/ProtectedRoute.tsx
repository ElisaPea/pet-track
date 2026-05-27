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
  const { userAuthenticated, role, loading, isLoggingOut } = useAuth();

  // 1. Si está cargando la sesión inicial de Supabase
  if (loading || isLoggingOut) return <p>Cargando sesión...</p>;

  // 2. Si no hay usuario en absoluto
  if (!userAuthenticated) return <Navigate to={SCREEN.LOGIN} />;

  // 3. Si hay sesión pero el AuthContext terminó de cargar y no hay rol o userState
  // (Esto significa que la query de perfil falló o el usuario no existe en la tabla User)
  if (!loading && userAuthenticated && !role) {
    console.error(
      "Error crítico: Sesión activa pero sin perfil en base de datos.",
    );
    return <Navigate to={SCREEN.LANDING_PAGE} />;
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
