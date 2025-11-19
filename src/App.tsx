import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home"; // Lo mantengo importado por si quieres usarlo dentro como "/inicio"
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
          {/* --- ZONA PÚBLICA (Acceso libre) --- */}
          
          {/* 1. La entrada principal es el LOGIN */}
          <Route path="/" element={<Login />} />
          
          {/* 2. Registro público */}
          <Route path="/registro" element={<Registro />} />
          
          {/* 3. Páginas informativas públicas */}
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />


          {/* --- ZONA PRIVADA (Requiere Login) --- */}
          {/* El componente ProtectedRoute actúa como guardia aquí */}
          <Route element={<ProtectedRoute />}>
            
              {/* Si quieres que 'Home' sea la bienvenida tras loguearse, puedes usar esta ruta: */}
              <Route path="/inicio" element={<Home />} />

              <Route path="/perfil" element={<Perfil />} />
              
              {/* Paneles de Roles */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* Funcionalidades protegidas */}
              <Route path="/pedir-hora" element={<PedirHora />} />

              {/* Rutas de Seguros */}
              <Route path="/seguros/venta" element={<VentaSeguros />} />
              <Route path="/comprar-seguro-salud" element={<ComprarSeguroSalud />} />
              <Route path="/comprar-seguro-vida" element={<ComprarSeguroVida />} />
          
          </Route>

          {/* --- SEGURIDAD EXTRA --- */}
          {/* Si alguien escribe una ruta loca (ej: /loquesea), lo mandamos al Login */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}