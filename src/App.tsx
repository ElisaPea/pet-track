import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import HomeVet from "./pages/HomeVet";
import WelcomeUser from "./pages/WelcomeUser";
import AccountSettingsUser from "./pages/AccountSettingsUser";
import AccountSettingsVet from "./pages/AccountSettingsVet";
import ListVetCenters from "./pages/ListVetCenters";
import { SCREEN } from "./constants/constants";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={SCREEN.LANDING_PAGE} element={<LandingPage />} />
          <Route path={SCREEN.LOGIN} element={<Login />} />
          <Route
            path={SCREEN.HOME_VET}
            element={
              <ProtectedRoute requiredRole="professional">
                <HomeVet />
              </ProtectedRoute>
            }
          />
          <Route
            path={SCREEN.WELCOME_USER}
            element={
              <ProtectedRoute requiredRole="user">
                <WelcomeUser />
              </ProtectedRoute>
            }
          />
          <Route
            path={SCREEN.settingsUser}
            element={
              <ProtectedRoute requiredRole="user">
                <AccountSettingsUser />
              </ProtectedRoute>
            }
          />
          <Route
            path={SCREEN.settingsVet}
            element={
              <ProtectedRoute requiredRole="professional">
                <AccountSettingsVet />
              </ProtectedRoute>
            }
          />
          <Route
            path={SCREEN.listVet}
            element={
              <ProtectedRoute requiredRole="user">
                <ListVetCenters />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
