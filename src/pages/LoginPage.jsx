import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/edisatc-logo.png";
import { apiFetch } from "../api/client.js";

const BG_GRADIENT =
  "linear-gradient(180deg, #DCFF7C 0%, #80CC71 12%, #15685A 85%, #14565D 98%)";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const usuario = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/editais-abertos");
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
      <main className="w-full max-w-5xl bg-white rounded-xl shadow-2xl px-6 py-10 sm:px-14 sm:py-12">
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F2F2F]">
            Bem-vindo(a)!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Faça login para continuar
          </p>
        </header>

        <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-0">
          <div className="flex-1 flex items-center justify-center md:pr-12">
            <img
              src={logo}
              alt="EDISATC"
              className="w-56 sm:w-72 max-w-full select-none"
              draggable={false}
            />
          </div>

          <div className="hidden md:block w-px bg-[#CCCCCC]" />

          <div className="flex-1 w-full md:pl-12 flex items-center">
            <form onSubmit={handleSubmit} className="w-full space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  className="w-full h-12 rounded-md border border-[#CCCCCC] bg-[#FCFCFC] px-4 text-center text-[#2F2F2F] placeholder:text-gray-400 outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="w-full h-12 rounded-md border border-[#CCCCCC] bg-[#FCFCFC] px-4 text-center text-[#2F2F2F] placeholder:text-gray-400 outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
                />
              </div>

              {erro && (
                <p className="text-sm text-red-600 font-medium">{erro}</p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={carregando}
                  className="inline-flex items-center gap-2 h-11 rounded-md border border-[#D3D3D3] bg-[#F3F3F3] px-6 font-semibold text-[#2F2F2F] transition hover:bg-[#e9e9e9] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#348953]/30 disabled:opacity-50"
                >
                  {carregando ? "Entrando..." : "Entrar"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer className="text-center mt-10 text-sm text-gray-500">
          Não possui login?{" "}
          <Link
            to="/cadastro"
            className="font-semibold text-[#2F2F2F] underline underline-offset-2 hover:text-[#348953]"
          >
            Faça já seu cadastro
          </Link>
        </footer>
      </main>
    </div>
  );
}
