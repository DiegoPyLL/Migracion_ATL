import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Login from "./pages/login"; // 1. IMPORTA EL COMPONENTE LOGIN

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 2. AÑADE ESTA LÍNEA */}
        <Route path="/login" element={<Login />} /> 
        {/* Y así con todas las demás rutas que necesites */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
