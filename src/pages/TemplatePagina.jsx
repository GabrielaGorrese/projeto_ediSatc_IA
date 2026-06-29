import SideBar from "../components/SideBar.jsx";
import Header from "../components/Header.jsx";

export default function CadastrarProjeto() {
    return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#fff' }}>
        <SideBar className="h-full flex-shrink-0"/>
        <main className="flex-1 overflow-y-auto mx-auto w-full max-w-8xl rounded-xl bg-white px-6 py-6 sm:px-10 sm:py-8">
            <Header modo="voltar" voltarPara="/editais-abertos" />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-[#2C382D]">Título</h2>
            </div>
        </main>
        
    </div>
    );
}