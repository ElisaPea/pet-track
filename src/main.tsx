import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// 1. Importamos el componente de analíticas
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* 2. Añadimos las analíticas */}
    <Analytics />
  </StrictMode>,
);
