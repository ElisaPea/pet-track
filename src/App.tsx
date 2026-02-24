import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AccountSettingsUser from "./pages/AccountSettingsUser";
import AccountSettingsVet from "./pages/AccountSettingsVet";
import ListVetCenters from "./pages/ListVetCenters";
import { SCREEN } from "./constants/constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SCREEN.HOME} element={<Home />} />
        <Route path={SCREEN.LOGIN} element={<Login />} />
        <Route path={SCREEN.settingsUser} element={<AccountSettingsUser />} />
        <Route path={SCREEN.settingsVet} element={<AccountSettingsVet />} />
        <Route path={SCREEN.listVet} element={<ListVetCenters />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
