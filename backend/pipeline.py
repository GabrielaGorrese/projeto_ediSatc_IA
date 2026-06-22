# Orquestra o fluxo completo: SCRAPING -> RESUMO (Gemini) -> POSTGRES (+ PLANILHA opcional).

from scraping.scraping import scrapingFAPESC
from resumo.resumoGemini import analisar_edital_pdf_gemini
from resumo.resumoGemini import analisar_edital_pdf_ollama
from banco.conexao import conectar
from banco import repositorio
import config


SCRAPERS = {
    "FAPESC": scrapingFAPESC,
}


def executar_pipeline(fontes=None):
    # Por enquanto o pipeline usa somente a FAPESC (ignora outras fontes pedidas).
    fontes = ["FAPESC"]

    # 1) Abre o banco e garante que a tabela existe
    conn = conectar()
    repositorio.criar_schema(conn)

    # 2) Pega o que já está salvo para o scraping NÃO repetir
    cadastrados = repositorio.listar_para_dedup(conn)

    # 3) SCRAPING: coleta os editais novos das fontes escolhidas
    print(f"\n=== 1/3 SCRAPING ({', '.join(fontes)}) ===")
    resultados = []
    erratas = []
    for fonte in fontes:
        scraper = SCRAPERS.get(fonte)
        if scraper is None:
            print(f"Fonte desconhecida, ignorando: {fonte}")
            continue
        coletado = scraper(cadastrados)
        # alguns coletores podem retornar None em caso de falha grave
        if not coletado:
            continue
        res, err = coletado
        resultados += res or []
        erratas += err or []

    # descarta editais sem link de PDF (não há o que mandar para o Gemini)
    resultados = [e for e in resultados if e.get("edital_link")]

    #  limita a quantidade para economizar a cota do Gemini
    if config.LIMITE_EDITAIS:
        resultados = resultados[:config.LIMITE_EDITAIS]

    print(f"\n=== 2/3 RESUMO + 3/3 BANCO ({len(resultados)} editais) ===")

    inseridos = 0
    editais_novos = []          # guarda os que entraram (para planilha/e-mail)

    for i, edital in enumerate(resultados, start=1):
        print(f"\n[{i}/{len(resultados)}] {edital['titulo'][:60]}")

        # 4) RESUMO: manda o link do PDF para o Gemini
        resumo = analisar_edital_pdf_gemini(edital["edital_link"])

        # 5) BANCO: salva edital + resumo juntos
        novo_id = repositorio.inserir_edital(conn, edital, resumo)
        if novo_id:
            print(f"    Salvo no banco (id {novo_id})")
            inseridos += 1
            editais_novos.append(edital)
        else:
            print("    Já existia no banco (ignorado)")

    conn.close()

    # 6) PLANILHA (opcional): só roda se GRAVAR_SHEETS=true e houver editais novos
    if config.GRAVAR_SHEETS and editais_novos:
        print("\n=== PLANILHA: gravando no Google Sheets ===")
        # imports aqui dentro: só carrega gspread se for realmente usar a planilha
        from planilha.conectarPlanilha import conectarPlanilha
        from planilha.editarPlanilha import editarPlanilha

        wks, wksVencidos, wksAprovados = conectarPlanilha()
        editarPlanilha(1, wks, editais_novos, erratas,
                       ", ".join(fontes), len(editais_novos))
        print(" Planilha atualizada!")

    print(f"\n Concluído! {inseridos} edital(is) novo(s) salvos.")
    return inseridos


if __name__ == "__main__":
    executar_pipeline()
