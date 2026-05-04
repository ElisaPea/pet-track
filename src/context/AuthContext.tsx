import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";

interface AuthContextType {
  userAuthenticated: User | null;
  role: "user" | "professional" | null;
  loading: boolean;

  updateAuth: (session: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "professional" | null>(null);
  const [loading, setLoading] = useState(true);

  const updateAuth = async (session: any) => {
    if (session?.user) {
      setUser(session.user);

      // Buscamos el rol sabiendo que ya existe la fila
      const { data } = await supabase
        .from("User")
        .select("role")
        .eq("id", session.user.id)
        .single();

      setRole(data?.role || null);
    } else {
      setUser(null);
      setRole(null);
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
          setUser(null);
          setRole(null);
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userAuthenticated: user, role, loading, updateAuth }}
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
