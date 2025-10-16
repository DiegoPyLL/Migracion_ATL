import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Login from "./pages/login";
import Registro from "./pages/registro";
import Perfil from "./pages/perfil";
import VentaSeguros from "./pages/ventaSeguros";
import ComprarSeguroSalud from "./pages/comprar_seguro_salud";
import ComprarSeguroVida from "./pages/compra_seguro_vida";


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />


        {/* --- RUTAS DE SEGUROS --- */}
        
        {/* Ruta para la "vitrina" con las tarjetas */}
        <Route path="/seguros/venta" element={<VentaSeguros />} />
        
        {/* Ruta para el formulario de compra específico */}
        <Route path="/comprar-seguro-salud" element={<ComprarSeguroSalud />} />
        <Route path="/comprar-seguro-vida" element={<ComprarSeguroVida />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}