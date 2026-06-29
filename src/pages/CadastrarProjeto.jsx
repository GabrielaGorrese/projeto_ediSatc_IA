import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Obrigatorio from "../components/Obrigatorio.jsx";

function CategoriaTag({ children }) {
  return (
    <span className="inline-block rounded border border-[#4DB577] bg-[#C0E5BA]/25 px-4 py-2 text-sm font-bold tracking-wide text-[#348953]">
      {children}
    </span>
  );
}

export default function CadastrarProjeto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [edital, setEdital] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataCriacao, setDataCriacao] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState("");

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const nomeSolicitante = usuario.nome || usuario.email?.split("@")[0] || "Usuário";

    useEffect(() => {
        apiFetch(`/editais/${id}`)
        .then(setEdital)
        .catch((err) => setErro(err.message))
        .finally(() => setCarregando(false));
    }, [id]);

    async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErroEnvio("");

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    try {
        await apiFetch("/projetos", {
            method: "POST",
            body: JSON.stringify({
            nome,
            descricao,
            data_criacao: dataCriacao,
            edital_id: Number(id),
            usuario_id: usuario.id,
            }),
        });
        navigate(`/editais/${id}`);
        } catch (err) {
        setErroEnvio(err.message || "Erro ao cadastrar projeto");
        } finally {
        setEnviando(false);
        }
    }

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "#fff" }}>
        <SideBar className="h-full flex-shrink-0" />
        <main className="flex-1 overflow-y-auto mx-auto w-full max-w-8xl rounded-xl bg-white px-6 py-6 sm:px-10 sm:py-8">
            <Header modo="voltar" voltarPara={`/editais/${id}`} />

            <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#2C382D]">Cadastrar Projeto</h2>
            </div>

            {carregando && (
            <p className="mt-12 text-center text-gray-500">Carregando edital...</p>
            )}

            {erro && <p className="mt-12 text-center text-red-600">{erro}</p>}

            {edital && (
            <>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
                    {edital.titulo}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    {edital.tag && <CategoriaTag>{edital.tag}</CategoriaTag>}
                </div>

                <div className="mt-8 border-t border-[#CCCCCC]" />

                <form onSubmit={handleSubmit} className="mt-8 max-w-5xl space-y-5">
                
                <div className="flex flex-col gap-4 md:flex-row">

                    <div>
                    <label className="block text-sm font-semibold text-[#2C382D]">
                        Solicitante
                        <Obrigatorio />
                    </label>
                    <input
                        type="text"
                        disabled
                        value={nomeSolicitante}
                        className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-gray-100 px-3 py-2 text-sm text-gray-500 outline-none"
                        />
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-[#2C382D]">
                        Coordenador
                        <Obrigatorio />
                    </label>
                    <input
                        type="text"
                        required
                        value="Bruno"
                        className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                    />
                    </div>

                    <div className="mx-8 w-px self-stretch bg-[#CCCCCC]" />

                    <div>
                    <label className="block text-sm font-semibold text-[#2C382D]">
                        Previsão de início
                        <Obrigatorio />
                    </label>
                    <input
                        type="date"
                        required
                        className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-[#2C382D]">
                        Previsão de término
                        <Obrigatorio />
                    </label>
                    <input
                        type="date"
                        required
                        className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#2C382D]">
                    Nome do projeto
                    <Obrigatorio />
                    </label>
                    <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#2C382D]">
                        Descrição
                    </label>
                    <textarea
                    required
                    rows={5}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                    />
                </div>

                {erroEnvio && (
                    <p className="text-sm text-red-600">{erroEnvio}</p>
                )}

                <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex items-center gap-2 rounded-md border border-[#348953] bg-[#348953] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2a7044] disabled:opacity-50"
                >
                    {enviando ? "Enviando..." : "Cadastrar projeto"}
                </button>
                </form>
            </>
            )}
        </main>
        </div>
    );
    }