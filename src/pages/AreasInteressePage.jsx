import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mesmo gradiente de fundo do Figma usado nas demais telas
const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

// Áreas extraídas do Figma (3 x 3)
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

  function toggle(area) {
    setSelecionadas((atual) =>
      atual.includes(area)
        ? atual.filter((a) => a !== area)
        : [...atual, area]
    );
  }

  function handleContinuar() {
    // TODO: enviar as áreas selecionadas para a API
    console.log("áreas de interesse", selecionadas);
    // Fluxo: após o cadastro/seleção, volta para a tela de login
    navigate("/");
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: BG_GRADIENT }}
    >
      <main className="w-full max-w-6xl bg-white rounded-xl shadow-2xl px-6 py-10 sm:px-14 sm:py-12">
        {/* Cabeçalho */}
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F2F2F]">
            Áreas de interesse
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Selecione uma ou mais áreas em que você tem interesse.
          </p>
        </header>

        {/* Separador */}
        <hr className="my-8 border-t border-[#CCCCCC]" />

        {/* Grade de áreas (3 colunas no desktop) */}
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
                  "flex items-center justify-center text-center h-[72px] rounded-md border px-4 font-semibold transition select-none focus:outline-none focus:ring-2 focus:ring-[#348953]/30 " +
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

        {/* Ação */}
        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={handleContinuar}
            className="inline-flex items-center gap-2 h-11 rounded-md border border-[#D3D3D3] bg-[#F3F3F3] px-6 font-semibold text-[#2F2F2F] transition hover:bg-[#e9e9e9] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#348953]/30"
          >
            Continuar
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </main>
    </div>
  );
}
