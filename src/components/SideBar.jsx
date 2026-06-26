import { DocumentTextIcon, LightBulbIcon, PaperClipIcon, UserIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";

export default function SideBar() {
  return (
    <aside className="h-screen w-1/6 shrink-0 bg-gradient-to-b from-[#295B46] to-[#14565D] text-white p-6 shadow-xl">

      <div className="flex items-center justify-center gap-2 h-10">
        <h1 className="text-xl">
          <span className="font-normal">Web</span>
          <span className="font-bold">NIT SATC</span>
        </h1>
      </div>

      <hr className="my-6 border-white" />

      <nav className="mt-10 space-y-6">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
            <DocumentTextIcon className="h-4 w-4 text-white" />
            Editais
          </h2>

          <hr className="my-2 border-white/20" />

          <Link to="/dashboard">
          <p className="ml-2 mt-3 cursor-pointer text-sm text-white/80 hover:text-white/60">Editais abertos</p>
          </Link>
          <p className="ml-2 mt-1 cursor-pointer text-sm text-white/80 hover:text-white/60">Projetos cadastrados</p>
        </div>

        <div>
          <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
            <LightBulbIcon className="h-4 w-4 text-white" />
            Prop. Intelectual
          </h2>

          <hr className="my-2 border-white/20" />

          <p className="ml-2 mt-3 cursor-pointer text-sm text-white/80 hover:text-white/60">Pedidos de patente</p>
          <p className="ml-2 mt-1 cursor-pointer text-sm text-white/80 hover:text-white/60">Marcas registradas</p>
          <p className="ml-2 mt-1 cursor-pointer text-sm text-white/80 hover:text-white/60">Softwares registrados</p>
        </div>

        <div>
          <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
            <PaperClipIcon className="h-4 w-4 text-white" />
            Documentos
          </h2>

          <hr className="my-2 border-white/20" />
          
          <p className="ml-2 mt-3 cursor-pointer text-sm text-white/80 hover:text-white/60">Modelos de contrato</p>
          <p className="ml-2 mt-1 cursor-pointer text-sm text-white/80 hover:text-white/60">Contratos NDA</p>
          <p className="ml-2 mt-1 cursor-pointer text-sm text-white/80 hover:text-white/60">Formulários</p>
        </div>

        <div>
          <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
            <UserIcon className="h-4 w-4 text-white" />
            Pesquisadores
          </h2>

          <hr className="my-2 border-white/20" />

          <p className="ml-2 mt-3 cursor-pointer text-sm text-white/80 hover:text-white/60">Índice H</p>
        </div>
      </nav>
    </aside>
  );
}