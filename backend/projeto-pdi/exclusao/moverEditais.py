# Move editais vencidos/rejeitados da página Editais Abertos para a página Editais Vencidos

from datetime import datetime, timedelta
from gspread.worksheet import Worksheet


def moverEditais(wks: Worksheet,
                 wksVencidos: Worksheet,
                 wksAprovados: Worksheet):

    print("\n-----------------------------------\nMover editais vencidos/aprovados/rejeitados\n-----------------------------------\n")
    print("Carregando...")

    def encontrarProximaLinha(planilha, linhaInicial):
        linhaAtual = linhaInicial
        while True:
            if not planilha.row_values(linhaAtual):
                return linhaAtual
            linhaAtual += 1

    editalVencido = False
    proximaLinhaVencidos = encontrarProximaLinha(wksVencidos, 11)
    proximaLinhaAprovados = encontrarProximaLinha(wksAprovados, 11)

    dados = wks.get("B11:L")
    datas_formatadas = wks.get("D11:E", value_render_option='FORMATTED_VALUE')

    i = 0

    while i < len(dados):
        try:
            linha = dados[i]

            # garante tamanho mínimo
            if len(linha) < 10:
                break

            prazo = linha[3]   # coluna E
            status = linha[9]  # coluna K

            if not prazo and not status:
                break

            prazoDatetime = None

            if prazo and prazo != "--":
                try:
                    prazoDatetime = datetime.strptime(prazo, "%d/%m/%Y")
                except:
                    prazoDatetime = None

            ontem = datetime.today() - timedelta(days=1)

            if (
                status == "REJEITADO"
                or status == "APROVADO"
                or (prazoDatetime and prazoDatetime < ontem)
            ):

                linhaPlanilha = i + 11  # converte índice → número real

                valores_formula = wks.get(
                    f"B{linhaPlanilha}:L{linhaPlanilha}",
                    value_render_option='FORMULA'
                )[0]

                valores_data = datas_formatadas[i]

                valores_formula[2] = valores_data[0]
                valores_formula[3] = valores_data[1]

                if status == "APROVADO":

                    print(
                        f"Movendo edital da linha {linhaPlanilha} para aprovados...")

                    wksAprovados.update(
                        f"B{proximaLinhaAprovados}:L{proximaLinhaAprovados}",
                        [valores_formula],
                        value_input_option='USER_ENTERED'
                    )

                    proximaLinhaAprovados += 1

                else:

                    print(
                        f"Movendo edital da linha {linhaPlanilha} para vencidos/rejeitados...")

                    wksVencidos.update(
                        f"B{proximaLinhaVencidos}:L{proximaLinhaVencidos}",
                        [valores_formula],
                        value_input_option='USER_ENTERED'
                    )

                    proximaLinhaVencidos += 1

                wks.delete_rows(linhaPlanilha)

                print("Edital movido com sucesso!\n")

                editalVencido = True

                # 🔥 MUITO IMPORTANTE: não incrementa i
                # porque a planilha subiu uma linha
                dados.pop(i)
                datas_formatadas.pop(i)

                continue

            else:
                i += 1

        except Exception as e:
            print("Erro:", e)
            break

    if editalVencido:
        print("Editais movidos com sucesso!")
    else:
        print("Nenhum edital vencido encontrado!")
