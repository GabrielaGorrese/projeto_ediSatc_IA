import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client.js";

const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

function formatarData(valor) {
  if (!valor || valor === "--") return "—";
  const m = String(valor).match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[1]}/${m[2]}/${m[3]}`;
  const d = new Date(valor);
  return isNaN(d) ? "—" : d.toLocaleDateString("pt-BR");
}

function Sparkle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#E4A11B" aria-hidden="true">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
      <path d="M18.5 14l.8 2.5 2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8.8-2.5z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#348953" strokeWidth="2" />
      <path d="M12 7v5l3.5 2" stroke="#348953" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#348953" strokeWidth="2" />
      <path d="M12 11v5" stroke="#348953" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.7" r="1.2" fill="#348953" />
    </svg>
  );
}
function MoneyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="#348953" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.6" stroke="#348953" strokeWidth="2" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h7l4 4v14H7z" stroke="#348953" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3v4h4" stroke="#348953" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#2C382D] sm:text-2xl">
      <span className="shrink-0">{icon}</span>
      {children}
    </h2>
  );
}

function CategoriaTag({ children }) {
  return (
    <span className="inline-block rounded border border-[#4DB577] bg-[#C0E5BA]/25 px-4 py-2 text-sm font-bold tracking-wide text-[#348953]">
      {children}
    </span>
  );
}

export default function EditalDetalhePage() {
  const { id } = useParams();
  const [edital, setEdital] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    apiFetch(`/editais/${id}`)
      .then(setEdital)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, [id]);

  const infos = edital
    ? [
        { titulo: "Objetivo principal", texto: edital.objetivo_principal },
        { titulo: "Área de atuação", texto: edital.area_atuacao },
        { titulo: "Custos e bolsas", texto: edital.custos_e_lucros_ou_bolsas },
        { titulo: "Outras informações", texto: edital.outras_informacoes_relevantes },
      ].filter((i) => i.texto)
    : [];

  const prazos = edital
    ? [
        { label: "Abertura das submissões", data: formatarData(edital.prazo_inicial) },
        { label: "Limite para submissões", data: formatarData(edital.prazo_final) },
      ].filter((p) => p.data !== "—")
    : [];

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-8"
      style={{ background: BG_GRADIENT }}
    >
      <main className="mx-auto w-full max-w-5xl rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-12 sm:py-8">
        <div className="flex items-center justify-between border-b border-[#CCCCCC] pb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#348953] hover:underline"
          >
            <span aria-hidden="true">←</span> Voltar para editais
          </Link>
          <span aria-hidden="true" className="h-9 w-9 rounded-full bg-[#D9D9D9]" />
        </div>

        {carregando && (
          <p className="mt-12 text-center text-gray-500">Carregando edital...</p>
        )}

        {erro && (
          <p className="mt-12 text-center text-red-600">{erro}</p>
        )}

        {edital && (
          <>
            <header className="mt-8">
              <h1 className="text-2xl font-bold uppercase leading-snug text-[#313B31] sm:text-[28px]">
                {edital.titulo}
              </h1>
              {edital.organizacao && (
                <p className="mt-2 text-sm font-semibold text-[#348953]">
                  {edital.organizacao}
                </p>
              )}
              {(edital.resumo || edital.objetivo_principal) && (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
                  {edital.resumo || edital.objetivo_principal}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {edital.tag && <CategoriaTag>{edital.tag}</CategoriaTag>}
                <Sparkle />
              </div>
            </header>

            {prazos.length > 0 && (
              <>
                <div className="my-8 border-t border-[#CCCCCC]" />
                <section>
                  <SectionTitle icon={<ClockIcon />}>Prazos importantes</SectionTitle>
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {prazos.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-md border border-[#CCCCCC] bg-[#FCFCFC] px-5 py-5 text-center"
                      >
                        <p className="text-sm text-gray-500">{p.label}</p>
                        <p className="mt-1 text-xl font-bold text-[#313B31]">{p.data}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {infos.length > 0 && (
              <>
                <div className="my-8 border-t border-[#CCCCCC]" />
                <section>
                  <SectionTitle icon={<InfoIcon />}>Informações adicionais</SectionTitle>
                  <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
                    {infos.map((info, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#348953]" />
                        <p className="text-sm leading-relaxed text-gray-600">
                          <span className="font-bold text-[#313B31]">{info.titulo}:</span>{" "}
                          {info.texto}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {edital.resumo_prazos && (
              <>
                <div className="my-8 border-t border-[#CCCCCC]" />
                <section>
                  <SectionTitle icon={<MoneyIcon />}>Resumo de prazos e valores</SectionTitle>
                  <div className="mt-6 rounded-md border border-[#CCCCCC] bg-[#FCFCFC] px-8 py-6">
                    <p className="text-sm leading-relaxed text-gray-600">{edital.resumo_prazos}</p>
                  </div>
                </section>
              </>
            )}

            {edital.edital_link && (
              <>
                <div className="my-8 border-t border-[#CCCCCC]" />
                <section>
                  <SectionTitle icon={<DocIcon />}>Documentos</SectionTitle>
                  <div className="mt-5">
                    <a
                      href={edital.edital_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#348953] underline underline-offset-2 hover:text-[#15685A]"
                    >
                      Acessar edital
                    </a>
                  </div>
                </section>
              </>
            )}

            <div className="mt-8 border-t border-[#CCCCCC]" />
          </>
        )}
      </main>
    </div>
  );
}
