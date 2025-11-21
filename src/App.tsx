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
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// --- COMPONENTE NUEVO: EL PORTERO DEL HOME ---
// Este componente decide si muestras el Home o rediriges al dashboard
const HomeRedirector = () => {
  const usuarioSesion = localStorage.getItem('usuario');

  if (usuarioSesion) {
    try {
      const usuario = JSON.parse(usuarioSesion);
      const rol = usuario.role ? usuario.role.toLowerCase() : '';

      // Si es personal médico/admin, NO deben estar en el Home público
      if (rol === 'doctor') {
        return <Navigate to="/doctor-dashboard" replace />;
      }
      if (rol === 'administrador') {
        return <Navigate to="/admin-dashboard" replace />;
      }
      // Si es paciente, dejamos que vea el Home (es útil para ellos)
    } catch (e) {
      // Si el JSON está mal, borramos y mostramos Home normal
      localStorage.removeItem('usuario');
    }
  }

  // Si no es doctor/admin, mostramos el Home
  return <Home />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-content">
        <Routes>
          {/* --- ZONA PÚBLICA --- */}
          
          {/* [CAMBIO] Usamos el Redirector en lugar de Home directo */}
          <Route path="/" element={<HomeRedirector />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/seguros/venta" element={<VentaSeguros />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />

          {/* --- ZONA PACIENTES --- */}
          <Route element={<RoleProtectedRoute allowedRole="paciente" />}>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/pedir-hora" element={<PedirHora />} />
              <Route path="/comprar-seguro-salud" element={<ComprarSeguroSalud />} />
              <Route path="/comprar-seguro-vida" element={<ComprarSeguroVida />} />
          </Route>

          {/* --- ZONA DOCTORES --- */}
          <Route element={<RoleProtectedRoute allowedRole="doctor" />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Route>

          {/* --- ZONA ADMIN --- */}
          <Route element={<RoleProtectedRoute allowedRole="administrador" />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Redirección por defecto al raíz (que ahora es inteligente) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}