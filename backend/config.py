import os

from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

DATABASE_URL = os.getenv('DATABASE_URL')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODELO = os.getenv('GEMINI_MODELO')
OLLAMA_MODELO = os.getenv('OLLAMA_MODELO', 'qwen2.5:7b')
OLLAMA_NUM_CTX = int(os.getenv('OLLAMA_NUM_CTX', '8192'))
LIMITE_EDITAIS = int(os.getenv('LIMITE_EDITAIS', '0'))
GRAVAR_SHEETS = os.getenv('GRAVAR_SHEETS') == 'true'
PLANILHA_ID = os.getenv('PLANILHA_ID', "")
