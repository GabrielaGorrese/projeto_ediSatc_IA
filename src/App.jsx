import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AreasInteressePage from "./pages/AreasInteressePage.jsx";
import EditaisAbertos from "./pages/EditaisAbertos.jsx";
import EditalDetalhePage from "./pages/EditalDetalhePage.jsx";
import CadastrarProjeto from "./pages/CadastrarProjeto.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/areas-interesse" element={<AreasInteressePage />} />
        <Route path="/editais-abertos" element={<EditaisAbertos />} />
        <Route path="/edital/:id" element={<EditalDetalhePage />} />
        <Route path="/editais/:id/cadastrar-projeto" element={<CadastrarProjeto />} />
      </Routes>
    </BrowserRouter>
  );
}
