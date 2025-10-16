import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";   // o "./components/header" si lo moviste
import Footer from "./components/footer";   // idem
import Home from "./pages/home";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
