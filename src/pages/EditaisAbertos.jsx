import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import EditalCard, { parseData, statusEdital, CategoriaTag } from "../components/EditalCard.jsx";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";


const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

const POR_PAGINA = 9;

const FONTES = ["FAPESC"];

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M3.5 8h9M5 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 4h11M6 4V2.8A.8.8 0 0 1 6.8 2h2.4a.8.8 0 0 1 .8.8V4M4 4l.6 8.2a1 1 0 0 0 1 .8h4.8a1 1 0 0 0 1-.8L12 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      <path d={dir === "left" ? "M12.5 4L7 10l5.5 6" : "M7.5 4L13 10l-5.5 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
function ChevronUpDown({ dir }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d={dir === "asc" ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FiltroBotao({ icon, children, ativo = false, sufixo, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition " +
        (ativo
          ? "border-[#348953] bg-[#348953]/10 text-[#348953] "
          : "border-[#D3D3D3] bg-white text-[#2C382D] hover:bg-gray-50 ") +
        className
      }
    >
      {icon}
      {children}
      {sufixo && <span className="ml-0.5">{sufixo}</span>}
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
        {tags.filter(Boolean).map((t, i) => (
          <CategoriaTag key={i}>{t}</CategoriaTag>
        ))}
      </div>
    </Link>
  );
}

export default function EditaisAbertos() {
  const [editais, setEditais] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(1);

  const [ordemPrazo, setOrdemPrazo] = useState(null);
  const [ordemOrg, setOrdemOrg] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState(null);

  const [buscando, setBuscando] = useState(false);
  const [msgBusca, setMsgBusca] = useState("");
  const [fonte, setFonte] = useState("FAPESC");

  const [busca, setBusca] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nomeExibido = usuario.email
    ? usuario.email.split("@")[0].toUpperCase()
    : "USUÁRIO";

  const tagParams =
    Array.isArray(usuario.tag) && usuario.tag.length > 0
      ? "?" + usuario.tag.map((t) => `tag=${encodeURIComponent(t)}`).join("&")
      : null;

  function carregarEditais() {
  setCarregando(true);
  Promise.all([
    apiFetch("/editais"),
    tagParams ? apiFetch(`/editais${tagParams}`) : Promise.resolve([]),
  ])
    .then(([todos, porTag]) => {
      console.log("todos:", todos);
      console.log("porTag:", porTag);
      setEditais(todos);
      setRecomendados(porTag.slice(0, 2));
    })
    .catch((err) => {
      console.error("Erro ao carregar editais:", err);
    })
    .finally(() => {
      console.log("finally executado -> setCarregando(false)");
      setCarregando(false);
    });
}

  useEffect(() => {
    carregarEditais();
  }, []);

  async function buscarNovosEditais() {
    setBuscando(true);
    setMsgBusca("");
    try {
      const res = await apiFetch(
        `/pipeline/executar?fonte=${encodeURIComponent(fonte)}`,
        { method: "POST" }
      );
      setMsgBusca(res.mensagem || "Busca iniciada! Recarregue em alguns minutos.");
    } catch (err) {
      setMsgBusca("Erro ao iniciar busca: " + err.message);
    } finally {
      setBuscando(false);
    }
  }

  function ciclarOrdem(atual, setter, outroCampoSetter) {
    outroCampoSetter(null);
    setter(atual === null ? "asc" : atual === "asc" ? "desc" : null);
    setPagina(1);
  }

  function ciclarStatus() {
    setFiltroStatus((s) =>
      s === null ? "A vencer" : s === "A vencer" ? "Vencido" : null
    );
    setPagina(1);
  }

  function limparFiltros() {
    setOrdemPrazo(null);
    setOrdemOrg(null);
    setFiltroStatus(null);
    setPagina(1);
  }

const editaisFiltrados = useMemo(() => {
  let lista = [...editais];

  if (busca.trim()) {
    const termo = busca.trim().toLowerCase();
    lista = lista.filter((e) =>
      e.titulo?.toLowerCase().includes(termo)
    );
  }

  if (filtroStatus) {
    lista = lista.filter((e) => statusEdital(e.prazo_final) === filtroStatus);
  }

  if (ordemPrazo) {
    lista.sort((a, b) => {
      const da = parseData(a.prazo_final);
      const db = parseData(b.prazo_final);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return ordemPrazo === "asc" ? da - db : db - da;
    });
  } else if (ordemOrg) {
    lista.sort((a, b) => {
      const oa = a.organizacao || "";
      const ob = b.organizacao || "";
      return ordemOrg === "asc"
        ? oa.localeCompare(ob, "pt-BR")
        : ob.localeCompare(oa, "pt-BR");
    });
  }

  return lista;
}, [editais, busca, ordemPrazo, ordemOrg, filtroStatus]);

  const idMaisRecente = editais.length
    ? Math.max(...editais.map((e) => e.id))
    : null;

  const totalPaginas = Math.max(1, Math.ceil(editaisFiltrados.length / POR_PAGINA));
  const paginaAtual = editaisFiltrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  const temFiltro = ordemPrazo || ordemOrg || filtroStatus;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#fff' }}>
      <SideBar className="h-full flex-shrink-0"/>
      <main className="flex-1 overflow-y-auto mx-auto w-full max-w-8xl rounded-xl bg-white px-6 py-6 sm:px-10 sm:py-8">
        <Header modo="pesquisa" valorBusca={busca} aoBuscar={setBusca} />
        {/*
        {recomendados.length > 0 && (
          <section className="mt-6 rounded-xl border border-[#CCCCCC] bg-[#FCFCFC] p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#2C382D]">
              Para você <Sparkle />
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Editais recomendados com base no seu perfil
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {recomendados.map((r) => (
                <RecomendadoCard key={r.id} id={r.id} titulo={r.titulo} tags={[r.tag]} />
              ))}
            </div>
          </section>
        )}
        <div className="my-8 border-t border-[#CCCCCC]" />
        */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#2C382D]">Editais abertos</h2>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <select
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
                disabled={buscando}
                aria-label="Fonte dos editais"
                className="rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm font-semibold text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30 disabled:opacity-50"
              >
                {FONTES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={buscarNovosEditais}
                disabled={buscando}
                className="inline-flex items-center gap-2 rounded-md border border-[#348953] bg-[#348953] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2a7044] disabled:opacity-50"
              >
                <SearchIcon />
                {buscando ? "Buscando..." : "Buscar novos editais"}
              </button>
            </div>
            {msgBusca && (
              <p className="text-xs text-gray-500 max-w-xs text-right">{msgBusca}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-[#CCCCCC] bg-[#FCFCFC] p-4">
          <FiltroBotao
            icon={<SortIcon />}
            ativo={!!ordemPrazo}
            sufixo={ordemPrazo ? <ChevronUpDown dir={ordemPrazo} /> : null}
            onClick={() => ciclarOrdem(ordemPrazo, setOrdemPrazo, setOrdemOrg)}
          >
            Prazos
          </FiltroBotao>

          <FiltroBotao
            icon={<SortIcon />}
            ativo={!!ordemOrg}
            sufixo={ordemOrg ? <ChevronUpDown dir={ordemOrg} /> : null}
            onClick={() => ciclarOrdem(ordemOrg, setOrdemOrg, setOrdemPrazo)}
          >
            Organização
          </FiltroBotao>

          <FiltroBotao
            icon={<SortIcon />}
            ativo={!!filtroStatus}
            onClick={ciclarStatus}
          >
            {filtroStatus ?? "Status"}
          </FiltroBotao>

          {temFiltro && (
            <FiltroBotao
              icon={<TrashIcon />}
              onClick={limparFiltros}
              className="ml-auto"
            >
              Limpar filtros
            </FiltroBotao>
          )}
        </div>

        {carregando ? (
          <p className="mt-10 text-center text-gray-500">Carregando editais...</p>
        ) : editaisFiltrados.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">Nenhum edital encontrado.</p>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginaAtual.map((e) => (
                <EditalCard key={e.id} edital={e} novo={e.id === idMaisRecente} />
              ))}
            </div>

            {totalPaginas > 1 && (
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
            )}
          </>
        )}
      </main>
    </div>
  );
}
