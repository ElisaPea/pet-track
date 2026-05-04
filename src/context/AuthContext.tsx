import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";

interface AuthContextType {
  userAuthenticated: User | null;
  role: "user" | "professional" | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getUserRole: (session: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "professional" | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = async (session: any) => {
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from("User")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error al obtener el rol:", error);
      return null;
    }

    return data?.role; // Devolvemos solo el string 'user' o 'professional'
  };

  useEffect(() => {
    // 1. Comprobar sesión actual al arrancar
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        // Buscamos el rol en la tabla "User"
        const role = await getUserRole(session);
        setRole(role);
      }
      setLoading(false);
    };

    getSession();

    // En AuthContext.tsx, dentro del useEffect de onAuthStateChange:
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Intentar pillar el rol siempre que haya sesión
          const { data } = await supabase
            .from("User")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setUser(session.user);
          setRole(data?.role || null);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ userAuthenticated: user, role, loading, signOut, getUserRole }}
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
