import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AreasInteressePage from "./pages/AreasInteressePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EditalDetalhePage from "./pages/EditalDetalhePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/areas-interesse" element={<AreasInteressePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/edital/:id" element={<EditalDetalhePage />} />
      </Routes>
    </BrowserRouter>
  );
}
