import { useState } from "react";
import { Link } from "react-router-dom";

// Mesmo gradiente de fundo do Figma usado nas demais telas
const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

// Dados de exemplo (substituir pela resposta da API de editais)
const RECOMENDADOS = [
  {
    titulo: "EDITAL SUPLEMENTAR FAPESC N.º 66/2025 PROGRAMA HORIZONTE EUROPA...",
    tags: ["ADMINISTRAÇÃO", "ADMINISTRAÇÃO"],
  },
  {
    titulo: "EDITAL SUPLEMENTAR FAPESC N.º 66/2025 PROGRAMA HORIZONTE EUROPA...",
    tags: ["ADMINISTRAÇÃO", "ADMINISTRAÇÃO"],
  },
];

const EDITAIS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  status: "A vencer",
  data: "27/03/2026",
  titulo: "EDITAL SUPLEMENTAR FAPESC N.º 66/2025 PROGRAMA HORIZONTE EUROPA...",
  descricao:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lacinia efficitur sem in fermentum. Pellentesque dictum...",
  categoria: "ADMINISTRAÇÃO",
}));

/* ----------------------------- Ícones ----------------------------- */
function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 4h12M3.5 8h9M5 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4h11M6 4V2.8A.8.8 0 0 1 6.8 2h2.4a.8.8 0 0 1 .8.8V4M4 4l.6 8.2a1 1 0 0 0 1 .8h4.8a1 1 0 0 0 1-.8L12 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Sparkle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#E4A11B" aria-hidden="true">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
      <path d="M18.5 14l.8 2.5 2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8.8-2.5z" />
    </svg>
  );
}
function Chevron({ dir = "left" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M12.5 4L7 10l5.5 6" : "M7.5 4L13 10l-5.5 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#7A7A7A" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

/* ------------------------- Subcomponentes ------------------------- */
function CategoriaTag({ children }) {
  return (
    <span className="inline-block rounded border border-[#4DB577] bg-[#C0E5BA]/25 px-3 py-1 text-xs font-bold tracking-wide text-[#348953]">
      {children}
    </span>
  );
}

function FiltroBotao({ icon, children, className = "" }) {
  return (
    <button
      type="button"
      className={
        "inline-flex items-center gap-2 rounded-md border border-[#D3D3D3] bg-white px-4 py-2 text-sm font-semibold text-[#2C382D] transition hover:bg-gray-50 " +
        className
      }
    >
      {icon}
      {children}
    </button>
  );
}

function RecomendadoCard({ id, titulo, tags }) {
  return (
    <Link
      to={`/edital/${id}`}
      className="relative block overflow-hidden rounded-lg border border-[#B1B1B1] bg-white p-4 pl-6 transition hover:border-[#348953] hover:shadow-md"
    >
      <span className="absolute left-0 top-0 h-full w-1.5 bg-[#FFA500]" />
      <h4 className="font-bold leading-snug text-[#2C382D]">{titulo}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t, i) => (
          <CategoriaTag key={i}>{t}</CategoriaTag>
        ))}
      </div>
    </Link>
  );
}

function EditalCard({ edital }) {
  return (
    <Link
      to={`/edital/${edital.id}`}
      className="flex flex-col rounded-2xl border border-[#B1B1B1] bg-white p-5 transition hover:border-[#348953] hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-[#313B31]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFA500]" />
          {edital.status}
        </span>
        <span className="rounded bg-[#E4D317]/20 px-2.5 py-1 text-sm font-semibold text-[#A8802B]">
          {edital.data}
        </span>
      </div>

      <div className="mt-3 h-0.5 rounded bg-[#FFA500]" />

      <h3 className="mt-4 font-bold leading-snug text-[#2C382D]">
        {edital.titulo}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {edital.descricao}
      </p>

      <div className="mt-auto pt-5">
        <CategoriaTag>{edital.categoria}</CategoriaTag>
      </div>
    </Link>
  );
}

/* ------------------------------ Página ---------------------------- */
export default function DashboardPage() {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = 5;

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-8"
      style={{ background: BG_GRADIENT }}
    >
      <main className="mx-auto w-full max-w-6xl rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-10 sm:py-8">
        {/* Top bar */}
        <div className="flex items-center justify-end border-b border-[#CCCCCC] pb-4">
          <button
            type="button"
            aria-label="Perfil"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3E6EA] transition hover:bg-[#d6dade]"
          >
            <UserIcon />
          </button>
        </div>

        {/* Saudação */}
        <h1 className="mt-8 text-2xl font-bold text-[#2C382D] sm:text-3xl">
          Olá, BRUNO!
        </h1>

        {/* Para você */}
        <section className="mt-6 rounded-xl border border-[#CCCCCC] bg-[#FCFCFC] p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#2C382D]">
            Para você <Sparkle />
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Editais recomendados com base no seu perfil
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {RECOMENDADOS.map((r, i) => (
              <RecomendadoCard key={i} id={`rec-${i + 1}`} {...r} />
            ))}
          </div>
        </section>

        {/* Editais abertos */}
        <div className="my-8 border-t border-[#CCCCCC]" />
        <h2 className="text-2xl font-bold text-[#2C382D]">Editais abertos</h2>

        {/* Toolbar de filtros */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-[#CCCCCC] bg-[#FCFCFC] p-4">
          <FiltroBotao icon={<SortIcon />}>Prazos</FiltroBotao>
          <FiltroBotao icon={<SortIcon />}>Organização</FiltroBotao>
          <FiltroBotao icon={<SortIcon />}>Status</FiltroBotao>
          <FiltroBotao icon={<TrashIcon />} className="ml-auto">
            Limpar filtros
          </FiltroBotao>
        </div>

        {/* Grade de editais */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EDITAIS.map((e) => (
            <EditalCard key={e.id} edital={e} />
          ))}
        </div>

        {/* Paginação */}
        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Página anterior"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#2C382D] transition hover:bg-gray-100 disabled:opacity-30"
            disabled={pagina === 1}
          >
            <Chevron dir="left" />
          </button>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#348953] text-lg font-semibold text-white">
            {pagina}
          </span>
          <button
            type="button"
            aria-label="Próxima página"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#2C382D] transition hover:bg-gray-100 disabled:opacity-30"
            disabled={pagina === totalPaginas}
          >
            <Chevron dir="right" />
          </button>
        </div>
      </main>
    </div>
  );
}
