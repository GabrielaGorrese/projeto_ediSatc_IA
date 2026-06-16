import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/edisatc-logo.png";

// Mesmo gradiente de fundo do Figma usado na tela de login
const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

const inputClass =
  "w-full h-12 rounded-md border border-[#CCCCCC] bg-[#FCFCFC] px-4 text-center text-[#2F2F2F] placeholder:text-gray-400 outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  function update(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: integrar com a API de cadastro
    console.log("cadastro", form);
    // Após o cadastro, segue para a seleção de áreas de interesse
    navigate("/areas-interesse");
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: BG_GRADIENT }}
    >
      <main className="w-full max-w-5xl bg-white rounded-xl shadow-2xl px-6 py-10 sm:px-14 sm:py-12">
        {/* Cabeçalho */}
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F2F2F]">
            Cadastro
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Crie sua conta para personalizar sua experiência
          </p>
        </header>

        {/* Conteúdo: logo | divisória | formulário */}
        <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-0">
          {/* Logo */}
          <div className="flex-1 flex items-center justify-center md:pr-12">
            <img
              src={logo}
              alt="EDISATC"
              className="w-56 sm:w-72 max-w-full select-none"
              draggable={false}
            />
          </div>

          {/* Divisória vertical (somente desktop) */}
          <div className="hidden md:block w-px bg-[#CCCCCC]" />

          {/* Formulário */}
          <div className="flex-1 w-full md:pl-12 flex items-center">
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div>
                <label
                  htmlFor="nome"
                  className="block font-semibold text-[#2F2F2F] mb-2"
                >
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={update("nome")}
                  placeholder="Digite seu nome"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold text-[#2F2F2F] mb-2"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="Digite seu e-mail"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="block font-semibold text-[#2F2F2F] mb-2"
                >
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  value={form.senha}
                  onChange={update("senha")}
                  placeholder="Digite sua senha"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-11 rounded-md border border-[#D3D3D3] bg-[#F3F3F3] px-6 font-semibold text-[#2F2F2F] transition hover:bg-[#e9e9e9] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#348953]/30"
                >
                  Continuar
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Voltar para login (não consta no Figma, mas mantém a navegação utilizável) */}
        <footer className="text-center mt-10 text-sm text-gray-500">
          Já possui uma conta?{" "}
          <Link
            to="/"
            className="font-semibold text-[#2F2F2F] underline underline-offset-2 hover:text-[#348953]"
          >
            Faça login
          </Link>
        </footer>
      </main>
    </div>
  );
}
