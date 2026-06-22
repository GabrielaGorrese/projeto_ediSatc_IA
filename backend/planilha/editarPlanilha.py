# adiciona os editais selecionados à planilha de Editais Abertos
# atualiza editais com erratas publicadas

from datetime import date


def editarPlanilha(resultadoAntigo, wks, resultados, erratas, org, resultadoTotal):

    if not resultados:
        print(f"Nenhum edital {org} a ser adicionado.\n")
        return

    nEdital = resultadoAntigo
    updates = []

    # funcao para encontrar próxima linha disponível com verificação de erratas
    def encontrarProximaLinha(planilha, linhaInicial, erratas):
        valores = planilha.get_all_values()
        titulos_erratas = {e['titulo'] for e in erratas}

        linhaAtual = linhaInicial - 1  # índice começa em 0
        isErrata = False

        while linhaAtual < len(valores):
            linha = valores[linhaAtual]

            titulo_planilha = linha[6] if len(linha) > 6 else ""

            if titulo_planilha in titulos_erratas:
                isErrata = True
                return linhaAtual + 1, isErrata

            if not any(linha):
                return linhaAtual + 1, isErrata

            linhaAtual += 1

        return linhaAtual + 1, isErrata

    proximaLinha, isErrata = encontrarProximaLinha(wks, 11, erratas)

    # adição de editais
    for resultado in resultados:
        try:
            linhaAtual = proximaLinha

            data = date.today()
            dataFormatada = data.strftime("%d/%m/%Y")

            if not nEdital:
                nEdital = 1

            print(
                f"Adicionando edital {org} n° {nEdital}... ({nEdital}/{resultadoTotal})")

            nEdital += 1

            # --- adição de editais ---

            # adiciona ID
            updates.append({
                "range": f"B{linhaAtual}",
                "values": [["=LIN()-10"]]
            })

            # adiciona dados
            updates.append({
                "range": f"C{linhaAtual}:L{linhaAtual}",
                "values": [[
                    dataFormatada,
                    resultado['prazo_inicial'],
                    resultado['prazo_final'],
                    resultado['organizacao'],
                    # if not isErrata else f'ERRATA | {resultado["titulo"]}'
                    resultado['titulo'],
                    '[...]',
                    '',
                    '',
                    'EM ANÁLISE',
                    'NÃO'
                ]]
            })

            # adiciona hyperlinks
            updates.append({
                "range": f"I{linhaAtual}",
                "values": [[
                    f'=HIPERLINK("{resultado["pagina_link"]}"; IMAGE("https://cdn-icons-png.flaticon.com/32/74/74910.png"; 4; 24; 24))'
                ]]
            })

            updates.append({
                "range": f"J{linhaAtual}",
                "values": [[
                    f'=HIPERLINK("{resultado["edital_link"]}"; IMAGE("https://cdn-icons-png.flaticon.com/32/74/74910.png"; 4; 24; 24))'
                ]]
            })

            print(f"Edital adicionado com sucesso na linha {linhaAtual}!\n")

            proximaLinha += 1

        except Exception as e:
            print(e)

    # envia atualizações de uma vez para evitar overflow de requests
    wks.batch_update(
        updates,
        value_input_option="USER_ENTERED"
    )

    # --- formatação ---

    # data (coluna C)
    wks.format("C11:C", {
        "textFormat": {
            "foregroundColor": {
                "red": 0.45,
                "green": 0.45,
                "blue": 0.45
            },
            "fontSize": 11,
        }
    })

    # prazos, organização (colunas D, E e F)
    wks.format("D11:F", {
        "textFormat": {
            "fontSize": 12,
        }
    })

    # titulo (coluna G)
    wks.format("G11:G", {
        "textFormat": {
            "foregroundColor": {
                "red": 0.45,
                "green": 0.45,
                "blue": 0.45
            },
            "fontSize": 11,
        }
    })

    # comentarios adicionais (coluna H)
    wks.format("H11:H", {
        "textFormat": {
            "foregroundColor": {
                "red": 0.45,
                "green": 0.45,
                "blue": 0.45
            },
            "fontSize": 11,
        }
    })

    return nEdital
