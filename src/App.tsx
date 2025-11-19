import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import SobreNosotros from "./pages/sobre_nosotros";
import PedirHora from "./pages/pedirHora";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-content">
        <Routes>
          {/* --- ZONA PÚBLICA (Visible para todos) --- */}
          
          {/* 1. [CAMBIO] El inicio "/" ahora es el HOME público */}
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/seguros/venta" element={<VentaSeguros />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />


          {/* --- ZONA PRIVADA (Requiere Login) --- */}
          <Route element={<ProtectedRoute />}>
            
              {/* Aquí están las páginas que SÍ requieren cuenta */}
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* Si alguien en el Home público da clic en "Pedir Hora", 
                  el sistema lo detendrá aquí y lo mandará al Login */}
              <Route path="/pedir-hora" element={<PedirHora />} />

              <Route path="/comprar-seguro-salud" element={<ComprarSeguroSalud />} />
              <Route path="/comprar-seguro-vida" element={<ComprarSeguroVida />} />
          
          </Route>

          {/* Si escriben una ruta loca, los mandamos al Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}