import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../App.css";

import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import FormularioReserva from "./pages/formularioReserva";
import FormularioSeguros from "./pages/formularioSeguros";
import Login from "./pages/login";
import Main from "./main";
import PedirHora from "./pages/pedirHora";
import Perfil from "./pages/perfil";
import Registro from "./pages/registro";
import SobreNosotros from "./pages/sobre_nosotros";
import TyC from "./pages/TyC";
import VentaSeguros from "./pages/ventaSeguros";

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
