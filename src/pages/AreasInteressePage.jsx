import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client.js";

const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

const AREAS = [
  "Inovação",
  "Empreendedorismo",
  "Biotecnologia",
  "Sustentabilidade",
  "Industrial",
  "Marketing",
  "Computação",
  "Mecânica",
  "Elétrica",
];

export default function AreasInteressePage() {
  const navigate = useNavigate();
  const [selecionadas, setSelecionadas] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function toggle(area) {
    setSelecionadas((atual) =>
      atual.includes(area) ? atual.filter((a) => a !== area) : [...atual, area]
    );
  }

  async function handleContinuar() {
    if (selecionadas.length === 0) {
      setErro("Selecione pelo menos uma área antes de continuar.");
      return;
    }
    const cadastro = JSON.parse(sessionStorage.getItem("cadastro") || "{}");
    if (!cadastro.email || !cadastro.senha) {
      navigate("/cadastro");
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      await apiFetch("/registrar", {
        method: "POST",
        body: JSON.stringify({ email: cadastro.email, senha: cadastro.senha, tag: selecionadas }),
      });
      sessionStorage.removeItem("cadastro");
      navigate("/");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: BG_GRADIENT }}
    >
      <main className="w-full max-w-6xl bg-white rounded-xl shadow-2xl px-6 py-10 sm:px-14 sm:py-12">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F2F2F]">
            Área de interesse
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Selecione a área em que você tem interesse para personalizar seus editais.
          </p>
        </header>

        <hr className="my-8 border-t border-[#CCCCCC]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AREAS.map((area) => {
            const ativo = selecionadas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggle(area)}
                aria-pressed={ativo}
                className={
                  "flex items-center justify-center text-center h-18 rounded-md border px-4 font-semibold transition select-none focus:outline-none focus:ring-2 focus:ring-[#348953]/30 " +
                  (ativo
                    ? "border-[#348953] bg-[#348953]/10 text-[#348953] ring-1 ring-[#348953]"
                    : "border-[#CCCCCC] bg-[#F8F8F8] text-[#313B31] hover:border-[#348953]/60 hover:bg-[#F1F5F1]")
                }
              >
                {area}
              </button>
            );
          })}
        </div>

        {erro && (
          <p className="mt-4 text-sm text-red-600 font-medium">{erro}</p>
        )}

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={handleContinuar}
            disabled={carregando}
            className="inline-flex items-center gap-2 h-11 rounded-md border border-[#D3D3D3] bg-[#F3F3F3] px-6 font-semibold text-[#2F2F2F] transition hover:bg-[#e9e9e9] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#348953]/30 disabled:opacity-50"
          >
            {carregando ? "Cadastrando..." : "Continuar"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </main>
    </div>
  );
}
