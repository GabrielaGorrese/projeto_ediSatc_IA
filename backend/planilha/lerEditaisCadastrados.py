# lê editais já cadastrados na planilha para evitar adição de duplicatas

def lerEditaisCadastrados(wks):

    dados = wks.get("G11:J", value_render_option="FORMULA")

    editais = []

    for i, linha in enumerate(dados, start=11):

        titulo = linha[0] if len(linha) > 0 else None
        edital = linha[3] if len(linha) > 3 else None

        if titulo and edital:

            try:
                editalLink = edital.split('"')[1]
            except:
                editalLink = edital

            editais.append({
                "titulo": titulo,
                "editalLink": editalLink,
                "linha": i
            })

        if not titulo and not edital:
            break

    return editais

if __name__ == "__main__":
    lerEditaisCadastrados()