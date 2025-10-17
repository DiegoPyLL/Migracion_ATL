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
import TerminosCondiciones from "./pages/TyC";
import FormularioReserva from "./pages/pedirHora";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
        <Route path="/pedir-hora" element={<FormularioReserva />} />

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