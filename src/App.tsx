import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import HomeVet from "./pages/HomeVet";
import WelcomeUser from "./pages/Welcome-User";
import AccountSettingsUser from "./pages/AccountSettingsUser";
import AccountSettingsVet from "./pages/AccountSettingsVet";
import ListVetCenters from "./pages/ListVetCenters";
import { SCREEN } from "./constants/constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SCREEN.LANDING_PAGE} element={<LandingPage />} />
        <Route path={SCREEN.LOGIN} element={<Login />} />
        <Route path={SCREEN.HOME_VET} element={<HomeVet />} />
        <Route path={SCREEN.WELCOME_USER} element={<WelcomeUser />} />
        <Route path={SCREEN.settingsUser} element={<AccountSettingsUser />} />
        <Route path={SCREEN.settingsVet} element={<AccountSettingsVet />} />
        <Route path={SCREEN.listVet} element={<ListVetCenters />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
