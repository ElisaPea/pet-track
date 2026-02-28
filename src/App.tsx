import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import { SCREEN } from "./constants/constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SCREEN.LANDING_PAGE} element={<LandingPage />} />
        <Route path={SCREEN.LOGIN} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
