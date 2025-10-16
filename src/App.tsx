import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";   // o "./components/header" si lo moviste
import Footer from "./components/footer";   // idem
import Home from "./pages/home";
import SobreNosotros from "./pages/sobre_nosotros";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
