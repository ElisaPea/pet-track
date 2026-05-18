import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../api/supabaseClient";
import {
  getAcceptedRequests,
  getPendingRequests,
  getRejectedRequests,
} from "../api/createAssociationReq";

interface AssociationContextType {
  pendingRequests: any[];
  acceptedRequests: any[];
  rejectedRequests: any[];
  associatedVets: { id: string; name: string }[]; // Para badges del usuario
  loadingAssoc: boolean;
  refreshAssociations: () => Promise<void>;
}

const AssociationContext = createContext<AssociationContextType | undefined>(
  undefined,
);

export const AssociationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userState, role } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<any[]>([]);
  const [associatedVets, setAssociatedVets] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingAssoc, setLoadingAssoc] = useState(false);

  const refreshAssociations = useCallback(async () => {
    if (!userState?.email) return;
    setLoadingAssoc(true);

    try {
      //si el roel es profesional necesitamos el email del centro vet
      const emailToSearch =
        role === "user" ? userState.email : userState.vetCenterEmail;

      const pending = await getPendingRequests(emailToSearch, role!);
      setPendingRequests(pending);

      const accepted = await getAcceptedRequests(emailToSearch, role!);
      setAcceptedRequests(accepted);

      const rejected = await getRejectedRequests(userState.email, role!);
      setRejectedRequests(rejected);

      // Si es usuario, buscamos sus centros asociados (tabla Client)
      if (role === "user") {
        const { data, error } = await supabase
          .from("Client")
          .select(
            `
            veterinarycenterid,
            VeterinaryCenter ( name )
          `,
          )
          .eq("userid", userState.id);

        if (!error && data) {
          const vets = data.map((item: any) => ({
            id: item.veterinarycenterid,
            name: item.VeterinaryCenter?.name || "Centro Veterinario",
          }));
          setAssociatedVets(vets);
        }
      }
    } catch (err) {
      console.error("Error en AssociationProvider:", err);
    } finally {
      setLoadingAssoc(false);
    }
  }, [userState, role]);

  useEffect(() => {
    if (userState) {
      refreshAssociations();
    } else {
      setPendingRequests([]);
      setAssociatedVets([]);
    }
  }, [userState, refreshAssociations]);

  return (
    <AssociationContext.Provider
      value={{
        pendingRequests,
        acceptedRequests,
        rejectedRequests,
        associatedVets,
        loadingAssoc,
        refreshAssociations,
      }}
    >
      {children}
    </AssociationContext.Provider>
  );
};

export const useAssociation = () => {
  const context = useContext(AssociationContext);
  if (!context)
    throw new Error("useAssociation debe usarse dentro de AssociationProvider");
  return context;
};
