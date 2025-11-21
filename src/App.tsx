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

// --- COMPONENTE: PORTERO DEL HOME ---
// Decide si muestra el Home público o redirige al dashboard si ya tienes rol de "empleado"
const HomeRedirector = () => {
  const usuarioSesion = localStorage.getItem('usuario');

  if (usuarioSesion) {
    try {
      const usuario = JSON.parse(usuarioSesion);
      const rol = usuario.role ? usuario.role.toLowerCase() : '';

      // Si es doctor, a su oficina
      if (rol === 'doctor') {
        return <Navigate to="/doctor-dashboard" replace />;
      }
      // Si es administrativo (así se llama en tu BD), a su panel
      if (rol === 'administrativo') {
        return <Navigate to="/admin-dashboard" replace />;
      }
      // Si es paciente, puede ver el Home
    } catch (e) {
      localStorage.removeItem('usuario');
    }
  }
  return <Home />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-content">
        <Routes>
          {/* --- ZONA PÚBLICA --- */}
          
          {/* Inicio Inteligente */}
          <Route path="/" element={<HomeRedirector />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/seguros/venta" element={<VentaSeguros />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />

          {/* --- ZONA PACIENTES --- */}
          {/* Solo entran Pacientes (o usuarios sin rol definido como 'doctor/admin') */}
          <Route element={<RoleProtectedRoute allowedRole="paciente" />}>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/pedir-hora" element={<PedirHora />} />
              <Route path="/comprar-seguro-salud" element={<ComprarSeguroSalud />} />
              <Route path="/comprar-seguro-vida" element={<ComprarSeguroVida />} />
          </Route>

          {/* --- ZONA DOCTORES --- */}
          {/* Solo entran Doctores */}
          <Route element={<RoleProtectedRoute allowedRole="doctor" />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Route>

          {/* --- ZONA ADMINISTRATIVA --- */}
          {/* Solo entran Administrativos */}
          <Route element={<RoleProtectedRoute allowedRole="administrativo" />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* CATCH-ALL: Si la ruta no existe, vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}