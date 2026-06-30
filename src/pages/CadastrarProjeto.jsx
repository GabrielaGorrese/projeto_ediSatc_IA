import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { useRef } from "react";
import { UserIcon, PlusIcon, XMarkIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";
import Obrigatorio from "../components/Obrigatorio.jsx";


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

    const [valor, setValor] = useState("");

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const nomeSolicitante = usuario.nome || usuario.email?.split("@")[0] || "Usuário";

    const [equipe, setEquipe] = useState([nomeSolicitante]);
    const [novoMembro, setNovoMembro] = useState("");

    const [arquivos, setArquivos] = useState([]);
    const inputArquivoRef = useRef(null);

    function adicionarArquivos(e) {
        const novos = Array.from(e.target.files || []);
        if (novos.length === 0) return;
        setArquivos((atual) => [...atual, ...novos]);
        e.target.value = "";
    }

    function removerArquivo(index) {
        setArquivos((atual) => atual.filter((_, i) => i !== index));
    }

    function formatarTamanho(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function adicionarMembro() {
        const nome = novoMembro.trim();
        if (!nome) return;
        setEquipe((atual) => [...atual, nome]);
        setNovoMembro("");
    }

    function removerMembro(index) {
        setEquipe((atual) => atual.filter((_, i) => i !== index));
    }

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
        <main className="flex-1 overflow-y-auto mx-auto w-full max-w rounded-xl bg-white px-6 py-6 sm:px-10 sm:py-8">
            <Header modo="voltar" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-[#2C382D]">Cadastrar Projeto</h2>
            </div>

            {carregando && (
            <p className="mt-12 text-center text-gray-500">Carregando edital...</p>
            )}

            {erro && <p className="mt-12 text-center text-red-600">{erro}</p>}

            {edital && (
            <>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">
                    {edital.titulo}
                </p>
                <div className="mt-8 border-t border-[#CCCCCC]" />
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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

                            <div className="hidden w-px self-stretch bg-[#CCCCCC] md:mx-8 md:block" />

                            <div>
                                <label className="block text-sm font-semibold text-[#2C382D]">
                                    Previsão de início
                                    <Obrigatorio />
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 w-full min-w-[180px] rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
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
                                    className="mt-1 w-full min-w-[180px] rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#2C382D]">
                                    Valor total
                                    <Obrigatorio />
                                </label>
                                <div className="relative mt-1">
                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500">
                                        R$
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        required
                                        placeholder="0,00"
                                        value={valor}
                                        onChange={(e) => {
                                            let v = e.target.value.replace(/[^0-9,]/g, "");
                                            const partes = v.split(",");
                                            if (partes.length > 2) {
                                                v = partes[0] + "," + partes.slice(1).join("");
                                            }
                                            const [inteiro, decimal] = v.split(",");
                                            if (decimal !== undefined && decimal.length > 2) {
                                                v = inteiro + "," + decimal.slice(0, 2);
                                            }
                                            setValor(v);
                                        }}
                                        className="w-full rounded-md border border-[#D3D3D3] bg-white py-2 pl-10 pr-3 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                                    />
                                </div>
                            </div>
                        </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#2C382D]">
                            Informações adicionais
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="mt-1 w-full rounded-md border border-[#D3D3D3] bg-white px-3 py-2 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                        />
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">

                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-[#2C382D]">
                                Equipe executora
                            </label>
                            <div className="mt-1 flex h-[240px] w-full flex-col rounded-md border border-[#D3D3D3] bg-white px-3 py-2">
                                <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-5 [scrollbar-gutter:stable]">
                                {equipe.map((nome, i) => (
                                    <li
                                        key={i}
                                        className={
                                            i === 0
                                            ? "mt-1 w-full rounded-md border border-[#D3D3D3] bg-gray-100 px-3 py-2 text-sm text-gray-500 outline-none flex items-center justify-between"
                                            : "flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm text-[#2C382D] border border-[#D3D3D3]"
                                        }
                                        >
                                        <span className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4" />
                                            {nome}
                                        </span>
                                        {i !== 0 && (
                                            <button
                                            type="button"
                                            onClick={() => removerMembro(i)}
                                            className="text-gray-400 hover:text-red-500"
                                            aria-label={`Remover ${nome}`}
                                            >
                                            <XMarkIcon className="h-4 w-4 cursor-pointer" />
                                            </button>
                                        )}
                                    </li>
                                ))}
                                </ul>

                                <div className="mt-2 flex items-center gap-2 border-t border-[#EEEEEE] pt-2">
                                <input
                                    type="text"
                                    value={novoMembro}
                                    onChange={(e) => setNovoMembro(e.target.value)}
                                    onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        adicionarMembro();
                                    }
                                    }}
                                    placeholder="Nome do integrante"
                                    className="flex-1 rounded-md border border-[#D3D3D3] px-2 py-1 text-sm text-[#2C382D] outline-none focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                                />
                                <button
                                    type="button"
                                    onClick={adicionarMembro}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#348953] text-white transition hover:bg-[#2a7044]"
                                    aria-label="Adicionar integrante"
                                >
                                    <PlusIcon className="h-4 w-4 cursor-pointer" />
                                </button>
                                </div>
                            </div>
                            </div>

                        <div className="hidden w-px self-stretch bg-[#CCCCCC] md:mx-8 md:block" />

                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-[#2C382D]">
                                Arquivos
                            </label>
                            <div className="mt-1 flex min-h-[240px] h-xl w-full flex-col rounded-md border border-[#D3D3D3] bg-white px-3 py-2">
                                <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-5 [scrollbar-gutter:stable]">
                                {arquivos.map((arquivo, i) => (
                                    <li
                                    key={i}
                                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm text-[#2C382D] border border-[#D3D3D3]"
                                    >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <PaperClipIcon className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{arquivo.name}</span>
                                        <span className="shrink-0 text-xs text-gray-400">
                                        {formatarTamanho(arquivo.size)}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removerArquivo(i)}
                                        className="text-gray-400 hover:text-red-500"
                                        aria-label={`Remover ${arquivo.name}`}
                                    >
                                        <XMarkIcon className="h-4 w-4 cursor-pointer" />
                                    </button>
                                    </li>
                                ))}
                                </ul>

                                <div className="mt-2 flex items-center justify-between border-t border-[#EEEEEE] pt-2">
                                <span className="text-xs text-gray-400">
                                    {arquivos.length} arquivo{arquivos.length !== 1 ? "s" : ""} selecionado{arquivos.length !== 1 ? "s" : ""}
                                </span>
                                <input
                                    ref={inputArquivoRef}
                                    type="file"
                                    multiple
                                    onChange={adicionarArquivos}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => inputArquivoRef.current?.click()}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#348953] text-white transition hover:bg-[#2a7044]"
                                    aria-label="Adicionar arquivo"
                                >
                                    <PlusIcon className="h-4 w-4 cursor-pointer" />
                                </button>
                                </div>
                            </div>
                            </div>

                    </div>

                {erroEnvio && (
                    <p className="text-sm text-red-600">{erroEnvio}</p>
                )}

                <div className="mt-8 border-t border-[#CCCCCC]" />

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