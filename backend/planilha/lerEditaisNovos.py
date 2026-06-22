from gspread.worksheet import Worksheet
from datetime import date, timedelta

def lerEditaisNovos(wks: Worksheet):

    i = 11
    editaisNovos = []
    semanaPassada = date.today() - timedelta(weeks=1)
    semanaPassadaSerial = (semanaPassada - date(1899, 12, 30)).days

    valores = wks.get("C11:G", value_render_option='UNFORMATTED_VALUE')

    for linha in valores:
        if not linha or len(linha) < 1 or not linha[0]:
            break

        dataCadastro = linha[0]

        try:
            dataCadastro = int(dataCadastro)
        except ValueError:
            print(f"Data inválida na linha {i}: {dataCadastro}")
            i += 1
            continue

        if dataCadastro >= semanaPassadaSerial:
            titulo = linha[4] if len(linha) > 4 else None
            organizacao = linha[2] if len(linha) > 2 else None
            editaisNovos.append((titulo, organizacao))

        i += 1

    return (
        len(editaisNovos),
        editaisNovos[-1][0] if editaisNovos else None,
        editaisNovos[-1][1] if editaisNovos else None
    )