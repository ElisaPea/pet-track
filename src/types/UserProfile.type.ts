export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "user" | "professional";
  isactive: boolean;
  lgpdconsent: boolean;
  // Campos específicos de profesional (opcionales)
  licenseNumber?: string;
  veterinaryCenterId?: string;
  vetCenterEmail?: string;
}
