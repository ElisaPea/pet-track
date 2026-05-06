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

const routes = [
  { path: SCREEN.LANDING_PAGE, element: <LandingPage /> },
  { path: SCREEN.LOGIN, element: <Login /> },
  {
    path: SCREEN.HOME_VET,
    element: (
      <ProtectedRoute requiredRole="professional">
        <HomeVet />
      </ProtectedRoute>
    ),
  },
  {
    path: SCREEN.WELCOME_USER,
    element: (
      <ProtectedRoute requiredRole="user">
        <WelcomeUser />
      </ProtectedRoute>
    ),
  },
  {
    path: SCREEN.SETTINGS_USER,
    element: (
      <ProtectedRoute requiredRole="user">
        <AccountSettingsUser />
      </ProtectedRoute>
    ),
  },
  {
    path: SCREEN.SETTINGS_VET,
    element: (
      <ProtectedRoute requiredRole="professional">
        <AccountSettingsVet />
      </ProtectedRoute>
    ),
  },
  {
    path: SCREEN.LIST_VET,
    element: (
      <ProtectedRoute requiredRole="user">
        <ListVetCenters />
      </ProtectedRoute>
    ),
  },
];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
