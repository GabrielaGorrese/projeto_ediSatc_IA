import { MagnifyingGlassIcon, UserIcon} from "@heroicons/react/24/solid";
import { BellIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <div className="flex items-center gap-20 border-b mb-8 border-[#CCCCCC] pb-4">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-full rounded-md border border-[#D3D3D3] bg-white py-2 pl-9 pr-4 text-sm text-[#2C382D] outline-none transition focus:border-[#348953] focus:ring-2 focus:ring-[#348953]/30"
        />
      </div>
      <div className="flex items-center gap-4">
        <BellIcon className="h-6 w-6 text-gray-500/50 hover:text-gray-500/75"/>
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