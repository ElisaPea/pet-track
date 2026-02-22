import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import HomeUser from "./pages/HomeUser";
import { SCREEN } from "./constants/constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SCREEN.HOME} element={<Home />} />
        <Route path={SCREEN.LOGIN} element={<Login />} />
        <Route path={SCREEN.HOME_USER} element={<HomeUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
