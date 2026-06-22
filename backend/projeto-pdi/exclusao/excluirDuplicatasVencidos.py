# Lê a página Editais Vencidos e exclui editais repetidos

from gspread.worksheet import Worksheet


def excluirDuplicatasVencidos(wksVencidos: Worksheet):

    print("\n----------------------\nRemovendo duplicatas\n----------------------\n")

    print("Carregando...")

    i = 11
    editais = []
    editalDeletado = False

    while True:
        # lê titulos dos editais cadastrados
        titulo = wksVencidos.acell(f"G{i}").value
        editais.append(titulo)

        # se encontrar repetido, deleta
        if titulo in editais[:-1]:
            print(f"Excluindo edital duplicado na linha {i}...")
            wksVencidos.delete_rows(i)
            print(f"Edital excluído com sucesso!\n")
            editalDeletado = True
            continue

        if not titulo:
            break

        i += 1

    if not editalDeletado:
        print("Nenhum edital duplicado!\n")
