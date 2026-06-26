import { Link } from "react-router-dom";

function parseData(valor) {
  if (!valor || valor === "--") return null;
  const m = String(valor).match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const d = new Date(valor);
  return isNaN(d) ? null : d;
}

function formatarData(valor) {
  const d = parseData(valor);
  return d ? d.toLocaleDateString("pt-BR") : "—";
}

function statusEdital(prazoFinal) {
  const d = parseData(prazoFinal);
  if (!d) return "Sem prazo";
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return d >= hoje ? "A vencer" : "Vencido";
}

function CategoriaTag({ children }) {
  return (
    <span className="inline-block rounded border border-[#4DB577] bg-[#C0E5BA]/25 px-3 py-1 text-xs font-bold tracking-wide text-[#348953]">
      {children}
    </span>
  );
}

export default function EditalCard({ edital, novo = false }) {
  const status = statusEdital(edital.prazo_final);
  return (
    <Link
      to={`/edital/${edital.id}`}
      className={
        "flex flex-col rounded-2xl border bg-white p-5 transition hover:border-[#348953] hover:shadow-md " +
        (novo ? "border-[#348953] ring-2 ring-[#348953]/30" : "border-[#B1B1B1]")
      }
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-[#313B31]">
          <span
            className={
              "h-2.5 w-2.5 rounded-full " +
              (status === "A vencer" ? "bg-[#FFA500]" : status === "Vencido" ? "bg-red-400" : "bg-gray-400")
            }
          />
          {status}
          {novo && (
            <span className="rounded-full bg-[#348953] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Novo
            </span>
          )}
        </span>
        <span className="rounded bg-[#E4D317]/20 px-2.5 py-1 text-sm font-semibold text-[#A8802B]">
          {formatarData(edital.prazo_final)}
        </span>
      </div>

      <div className="mt-3 h-0.5 rounded bg-[#FFA500]" />

      <h3 className="mt-4 font-bold leading-snug text-[#2C382D]">{edital.titulo}</h3>
      <p className="mt-3 text-xs leading-relaxed text-gray-500 line-clamp-3">
        {edital.objetivo_principal || "—"}
      </p>

      <div className="mt-auto pt-5">
        {edital.tag && <CategoriaTag>{edital.tag}</CategoriaTag>}
      </div>
    </Link>
  );
}

export { parseData, formatarData, statusEdital, CategoriaTag };