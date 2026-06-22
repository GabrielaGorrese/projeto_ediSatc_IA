# conecta à planilha através da biblioteca GSpread, usando a SUA conta de serviço

import gspread
from pathlib import Path
from config import PLANILHA_ID

# caminho até o arquivo JSON da sua conta de serviço
CAMINHO_CREDENCIAIS = Path(__file__).parent.parent / \
    "credenciais" / "minha-conta-sheets.json"


def conectarPlanilha():
    print(" Carregando...")

    # autentica usando o arquivo JSON que você baixou do Google Cloud
    gc = gspread.service_account(filename=str(CAMINHO_CREDENCIAIS))

    # abre a planilha pelo ID (que está no .env)
    planilha = gc.open_by_key(PLANILHA_ID)

    wks = planilha.worksheet("🟨 | EDITAIS ABERTOS")
    wksAprovados = planilha.worksheet("🟩 | EDITAIS APROVADOS")
    wksVencidos = planilha.worksheet("🟥 | EDITAIS VENCIDOS/REJEITADOS")

    return wks, wksVencidos, wksAprovados
