import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";
import type { UserProfile } from "../types/UserProfile.type";
import { logout } from "../api/signInQuery";
import { useNavigate } from "react-router-dom";
import { SCREEN } from "../constants/constants";

interface AuthContextType {
  userAuthenticated: User | null;
  role: "user" | "professional" | null;
  loading: boolean;
  userState: any | null;
  updateAuth: (session?: any) => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "professional" | null>(null);
  const [userState, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  // const navigate = useNavigate();

  const updateAuth = async (session?: any) => {
    try {
      // Si no me pasas session, la busco yo mismo
      let currentSession = session;
      if (!currentSession) {
        const { data } = await supabase.auth.getSession();
        currentSession = data.session;
      }

      if (currentSession?.user) {
        setUserAuth(currentSession.user);

        // Consulta relacional con JOIN para traer todo de golpe
        const { data, error } = await supabase
          .from("User")
          .select(
            `
          *,
          Professional (
            licensenumber,
            veterinarycenterid
          )
        `,
          )
          .eq("id", currentSession.user.id)
          .single();

        if (error) throw error;

        // Mapeo y Merge de datos
        const fullProfile: UserProfile = {
          id: data.id,
          name: data.name,
          phone: data.phone,
          role: data.role,
          isactive: data.isactive,
          lgpdconsent: data.lgpdconsent,
          email: currentSession.user.email || "",
        };

        if (data.role === "professional" && data.Professional) {
          const profData = Array.isArray(data.Professional)
            ? data.Professional[0]
            : data.Professional;
          const vetId = profData?.veterinarycenterid;

          // 2. Solo si tenemos un ID válido, hacemos la segunda consulta
          if (vetId) {
            const { data: vetCenterData, error: vetError } = await supabase
              .from("VeterinaryCenter")
              .select("email")
              .eq("id", vetId)
              .single();

            if (vetError) throw vetError;
            fullProfile.licenseNumber = profData?.licensenumber;
            fullProfile.veterinaryCenterId = profData?.veterinarycenterid;
            fullProfile.vetCenterEmail = vetCenterData?.email;
          }
        }

        setUserState(fullProfile);
        setRole(data.role);
      } else {
        // Limpieza si no hay sesión
        setUserAuth(null);
        setUserState(null);
        setRole(null);
      }
    } catch (err) {
      console.error("Error en updateAuth:", err);
      //send to landing page and logout if necessary
      // navigate(SCREEN.LANDING_PAGE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await updateAuth(session);
      setLoading(false);
    };
    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setIsLoggingOut(true)
          setUserAuth(null);
          setRole(null);
          setUserState(null);
        }
        if (event === "SIGNED_IN") {
          setIsLoggingOut(false)
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userAuthenticated: userAuth,
        role,
        userState,
        loading,
        updateAuth,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
