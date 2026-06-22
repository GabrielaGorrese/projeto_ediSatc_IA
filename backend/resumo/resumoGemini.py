import io
import json
import requests
import PyPDF2
import google.generativeai as genai

from config import GEMINI_API_KEY, GEMINI_MODELO, OLLAMA_MODELO, OLLAMA_NUM_CTX

# Configura a chave do Gemini uma vez, ao importar o módulo.
genai.configure(api_key=GEMINI_API_KEY)

MAX_CHARS_TEXTO = OLLAMA_NUM_CTX * 3


def analisar_edital_pdf_gemini(url):
    print(f"   Baixando PDF: {url[:70]}...")

    # 1) Baixar o PDF (fingindo ser um navegador com o User-Agent)
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        resposta = requests.get(url, headers=headers, timeout=15)
        resposta.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"erro": f"Erro ao baixar o arquivo: {e}"}

    # 2) Extrair o texto de todas as páginas do PDF
    texto_extraido = ""
    try:
        arquivo_pdf = io.BytesIO(resposta.content)
        leitor = PyPDF2.PdfReader(arquivo_pdf)
        for pagina in leitor.pages:
            texto = pagina.extract_text()
            if texto:
                texto_extraido += texto + "\n"
    except Exception as e:
        return {"erro": f"Erro ao ler o PDF: {e}"}

    if not texto_extraido.strip():
        return {"erro": "PDF sem texto legível (provavelmente imagem escaneada)."}

    print("Resumindo com o Gemini...")

    # 3) Montar o modelo e o prompt
    modelo = genai.GenerativeModel(GEMINI_MODELO)

    prompt = f"""
    Analise o texto do edital a seguir.

    Sua tarefa é atuar como um analista. Resuma os detalhes do edital, catalogando-os
    para facilitar o trabalho dos colaboradores. Seja objetivo e claro.
    Não invente informações que não estejam no texto.
    Se algum campo não for encontrado no edital, use "Não informado".

    Estrutura esperada:

    - resumo: visão geral do edital (máx. 4 linhas)
    - objetivo_principal: máx. 2 linhas
    - area_atuacao: máx. 2 linhas
    - pesquisadores_necessarios: lista de áreas/perfis com justificativa
    - custos: custos envolvidos para o participante (máx. 2 linhas)
    - bolsas: valores, quantidade e duração (máx. 2 linhas)
    - financiamento: valor total disponibilizado em R$ (ex: "R$ 500.000,00" ou faixa)
    - prazos: três datas — abertura, limite de submissão e divulgação
    - tags: EXATAMENTE 3 tags escolhidas entre:
            Inovação, Empreendedorismo, Biotecnologia, Sustentabilidade,
            Industrial, Marketing, Computação, Mecânica, Elétrica

    Retorne EXCLUSIVAMENTE em JSON, exatamente nesta estrutura (sem markdown):
    {{
    "resumo_edital": {{
        "resumo": "...",
        "objetivo_principal": "...",
        "area_atuacao": "...",
        "pesquisadores_necessarios": ["...", "..."],
        "custos": "...",
        "bolsas": "...",
        "financiamento": "...",
        "prazos": {{
        "abertura_submissoes": "...",
        "limite_submissoes": "...",
        "divulgacao_resultados": "..."
        }},
        "tags": ["...", "...", "..."]
    }}
    }}

    Texto extraído do edital (PDF):
    {texto_extraido}
    """

    schema = {
        "type": "object",
        "properties": {
            "resumo_edital": {
                "type": "object",
                "properties": {
                    "resumo": {"type": "string"},
                    "objetivo_principal": {"type": "string"},
                    "area_atuacao": {"type": "string"},
                    "pesquisadores_necessarios": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "custos": {"type": "string"},
                    "bolsas": {"type": "string"},
                    "financiamento": {"type": "string"},
                    "prazos": {
                        "type": "object",
                        "properties": {
                            "abertura_submissoes": {"type": "string"},
                            "limite_submissoes": {"type": "string"},
                            "divulgacao_resultados": {"type": "string"}
                        },
                        "required": [
                            "abertura_submissoes",
                            "limite_submissoes",
                            "divulgacao_resultados"
                        ]
                    },
                    "tags": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "Inovação",
                                "Empreendedorismo",
                                "Biotecnologia",
                                "Sustentabilidade",
                                "Industrial",
                                "Marketing",
                                "Computação",
                                "Mecânica",
                                "Elétrica"
                            ]
                        }
                    }
                },
                "required": [
                    "resumo",
                    "objetivo_principal",
                    "area_atuacao",
                    "financiamento",
                    "prazos",
                    "tags"
                ]
            }
        },
        "required": ["resumo_edital"]
    }

    config_geracao = genai.GenerationConfig(
        response_mime_type="application/json",
        temperature=0.2,
        response_schema=schema
    )

    # 4) Chamar o Gemini e converter a resposta em dicionário Python
    try:
        resposta_ia = modelo.generate_content(
            prompt, generation_config=config_geracao)
        return json.loads(resposta_ia.text)
    except json.JSONDecodeError:
        return {"erro": "A IA não retornou um JSON válido.", "resposta_bruta": resposta_ia.text}
    except Exception as e:
        return {"erro": f"Erro na API do Gemini: {e}"}


def analisar_edital_pdf_ollama(url):
    print(f"   Baixando PDF: {url[:70]}...")

    # 1) Baixar o PDF (fingindo ser um navegador com o User-Agent)
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        resposta = requests.get(url, headers=headers, timeout=15)
        resposta.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"erro": f"Erro ao baixar o arquivo: {e}"}

    # 2) Extrair o texto de todas as páginas do PDF
    texto_extraido = ""
    try:
        arquivo_pdf = io.BytesIO(resposta.content)
        leitor = PyPDF2.PdfReader(arquivo_pdf)
        for pagina in leitor.pages:
            texto = pagina.extract_text()
            if texto:
                texto_extraido += texto + "\n"
    except Exception as e:
        return {"erro": f"Erro ao ler o PDF: {e}"}

    if not texto_extraido.strip():
        return {"erro": "PDF sem texto legível (provavelmente imagem escaneada)."}

    print("Resumindo com o Ollama...")

    # 3) Montar o prompt para o Ollama
    #    As chaves abaixo precisam bater EXATAMENTE com o que o

    #    banco.repositorio.inserir_edital() lê do "resumo_edital".
    prompt = f"""
    Analise o texto do edital a seguir e responda SEMPRE em português.

    Sua tarefa é atuar como um analista. Resuma os detalhes do edital, catalogando-os
    para facilitar o trabalho dos colaboradores. Seja objetivo e claro.
    Não invente informações que não estejam no texto.
    Se algum campo não for encontrado no edital, use "Não informado".

    Estrutura esperada (campos):

    - resumo: visão geral do edital (máx. 4 linhas)
    - objetivo_principal: máx. 2 linhas
    - area_atuacao: máx. 2 linhas
    - pesquisadores_necessarios: lista de áreas/perfis com justificativa
    - custos: custos envolvidos para o participante (máx. 2 linhas)
    - bolsas: valores, quantidade e duração (máx. 2 linhas)
    - financiamento: valor total disponibilizado em R$ (ex: "R$ 500.000,00" ou faixa)
    - prazos: três datas — abertura, limite de submissão e divulgação
    - tags: EXATAMENTE 3 tags escolhidas entre:
            Inovação, Empreendedorismo, Biotecnologia, Sustentabilidade,
            Industrial, Marketing, Computação, Mecânica, Elétrica

    Retorne EXCLUSIVAMENTE em JSON, exatamente nesta estrutura (sem markdown):
    {{
    "resumo_edital": {{
        "resumo": "...",
        "objetivo_principal": "...",
        "area_atuacao": "...",
        "tags": ["...", "...", "..."],
        "pesquisadores_necessarios": ["...", "..."],
        "custos": "...",
        "bolsas": "...",
        "financiamento": "...",
        "prazos": "...",
        "outras_informacoes_relevantes": "..."
    }}
    }}
    Texto extraído do edital (PDF):
    {texto_extraido[:MAX_CHARS_TEXTO]}
    """

    # Structured outputs: passar o schema no "format" força o phi3 a respeitar a
    # estrutura (o "json" puro só garante JSON válido, não as chaves certas).
    formato = {
        "type": "object",
        "properties": {
            "resumo_edital": {
                "type": "object",
                "properties": {
                    "resumo": {"type": "string"},
                    "objetivo_principal": {"type": "string"},
                    "area_atuacao": {"type": "string"},
                    "tags": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "Inovação", "Empreendedorismo", "Biotecnologia",
                                "Sustentabilidade", "Industrial", "Marketing",
                                "Computação", "Mecânica", "Elétrica"
                            ]
                        },
                        "minItems": 1,
                        "maxItems": 3
                    },
                    "pesquisadores_necessarios": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "custos": {"type": "string"},
                    "bolsas": {"type": "string"},
                    "financiamento": {"type": "string"},
                    "prazos": {"type": "string"},
                    "outras_informacoes_relevantes": {"type": "string"}
                },
                "required": [
                    "resumo", "objetivo_principal", "area_atuacao", "tags",
                    "pesquisadores_necessarios", "custos", "bolsas", "financiamento",
                    "prazos", "outras_informacoes_relevantes"
                ]
            }
        },
        "required": ["resumo_edital"]
    }

    enderco_ollama = "http://localhost:11434/api/generate"

    payload = {
        "model": OLLAMA_MODELO,
        "prompt": prompt,
        "stream": False,
        "format": formato,
        "options": {
            "temperature": 0.2,
            "num_ctx": OLLAMA_NUM_CTX,
            "num_predict": 2048,
        },
    }

    try:
        resposta = requests.post(enderco_ollama, json=payload, timeout=600)
        resposta.raise_for_status()
        texto_ia = resposta.json().get("response", "")
        return json.loads(texto_ia)
    except json.JSONDecodeError:
        return {"erro": "A IA não retornou um JSON válido.", "resposta_bruta": texto_ia}
    except requests.RequestException as e:
        return {"erro": f"Erro na API do Ollama: {e}"}
