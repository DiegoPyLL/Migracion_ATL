import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";

import Home from "./pages/home.tsx";
import FormularioReserva from "./pages/formularioReserva.tsx";
import FormularioSeguros from "./pages/formularioSeguros.tsx";
import Login from "./pages/login.tsx";
import Main from "./main.tsx";
import PedirHora from "./pages/pedirHora.tsx";
import Perfil from "./pages/perfil.tsx";
import Registro from "./pages/registro.tsx";
import SobreNosotros from "./pages/sobre_nosotros.tsx";
import TyC from "./pages/TyC.tsx";
import VentaSeguros from "./pages/ventaSeguros.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reserva" element={<FormularioReserva />} />
        <Route path="/seguros/formulario" element={<FormularioSeguros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/pedir-hora" element={<PedirHora />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/terminos-y-condiciones" element={<TyC />} />
        <Route path="/seguros/venta" element={<VentaSeguros />} />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
