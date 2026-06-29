import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, UserIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { BellIcon } from "@heroicons/react/24/outline";

export default function Header({ modo = "pesquisa", aoBuscar, valorBusca, voltarPara = "/" }) {
  return (
    <div className="flex items-center gap-20 border-b mb-8 border-[#CCCCCC] pb-4">
      {modo === "pesquisa" ? (
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={valorBusca}
            onChange={(e) => aoBuscar?.(e.target.value)}
            className="w-full rounded-md border border-[#D3D3D3] bg-white py-2 pl-9 pr-4 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
          />
        </div>
      ) : (
        <Link
          to={voltarPara}
          className="flex flex-1 items-center gap-2 border border-transparent py-2 text-sm font-semibold text-[#2C382D] transition hover:text-[#348953]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar para editais
        </Link>
      )}

      <div className="flex items-center gap-4">
        <BellIcon className="h-6 w-6 text-gray-500/50 hover:text-gray-500/75" />
        <button
          type="button"
          aria-label="Perfil"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3E6EA] transition hover:bg-[#d6dade]"
        >
          <UserIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}