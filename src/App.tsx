import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import WelcomeUser from "./pages/Welcome-User";
import { SCREEN } from "./constants/constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SCREEN.HOME} element={<Home />} />
        <Route path={SCREEN.LOGIN} element={<Login />} />
        <Route path={SCREEN.WELCOME_USER} element={<WelcomeUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
