import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home"; 
import Login from "./pages/login";
import Registro from "./pages/registro";
import Perfil from "./pages/perfil";
import SegurosListado from "./pages/SegurosListado";
import ContratarSeguro from "./pages/ContratarSeguro";
import TerminosCondiciones from "./pages/TyC";
import SobreNosotros from "./pages/sobre_nosotros";
import PedirHora from "./pages/pedirHora";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctoresList from "./pages/AdminDoctoresList";
import AdminDoctorDetail from "./pages/AdminDoctorDetail";
import AdminSegurosList from "./pages/AdminSegurosList";
import AdminSeguroNuevo from "./pages/AdminSeguroNuevo";
import AdminSeguroEditar from "./pages/AdminSeguroEditar";
import ExplorerPage from "./pages/admin/ExplorerPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Decide si muestra el Home público o redirige al dashboard si ya tienes rol de "usuario"
const HomeRedirector = () => {
  const usuarioSesion = localStorage.getItem("usuario");

  if (usuarioSesion) {
    try {
      const usuario = JSON.parse(usuarioSesion);
      const rol = usuario.role ? usuario.role.toLowerCase() : "";

      if (rol === "doctor") {
        return <Navigate to="/doctor-dashboard" replace />;
      }
      if (rol === "administrativo") {
        return <Navigate to="/admin-dashboard" replace />;
      }
    } catch (e) {
      localStorage.removeItem("usuario");
    }
  }
  return <Home />;
};

const AppRoutes = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/login";

  return (
    <>
      <Header />
      <main className="app-content">
        <Routes>
          {/* ZONA PÚBLICA */}
          <Route path="/" element={<HomeRedirector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/seguros/venta" element={<SegurosListado />} />
          <Route path="/seguros" element={<SegurosListado />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />

          {/* PACIENTES */}
          <Route element={<RoleProtectedRoute allowedRole="paciente" />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/pedir-hora" element={<PedirHora />} />
            <Route path="/seguros/:id/contratar" element={<ContratarSeguro />} />
          </Route>

          {/* DOCTORES */}
          <Route element={<RoleProtectedRoute allowedRole="doctor" />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Route>

          {/* ADMINISTRATIVOS */}
          <Route element={<RoleProtectedRoute allowedRole="administrativo" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctores" element={<AdminDoctoresList />} />
            <Route path="/admin/doctores/:doctorId" element={<AdminDoctorDetail />} />
            <Route path="/admin/seguros" element={<AdminSegurosList />} />
            <Route path="/admin/seguros/nuevo" element={<AdminSeguroNuevo />} />
            <Route path="/admin/seguros/:id/editar" element={<AdminSeguroEditar />} />
            <Route path="/admin/explorador" element={<ExplorerPage />} />
          </Route>

          {/* CATCH-ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
