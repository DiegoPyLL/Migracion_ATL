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
        <Route path="/login" element={<Login />} /> {/* 2. AGREGA LA RUTA PARA LOGIN */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}