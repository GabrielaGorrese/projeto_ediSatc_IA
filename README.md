# Sistema Inteligente de Análise de Editais Públicos

Projeto final da disciplina de Inteligência Artificial. Aplicação web que **coleta,
resume e categoriza automaticamente** editais públicos de fomento usando um modelo
generativo (Google Gemini) e os apresenta em uma interface personalizada por área
de interesse do usuário.

## Integrantes

- Brendon Cordova Silveira
- Bruno Pagani Rampinelli
- Gabriela de Souza Gorrese
- Isabela Zanette Martinello
- João Henrique Camilo Fogaça

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Técnica de IA](#técnica-de-ia)
- [Como funciona](#como-funciona)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Como executar](#como-executar)
- [Como usar](#como-usar)
- [Endpoints da API](#endpoints-da-api)
- [Limitações e observações](#limitações-e-observações)

## Sobre o projeto

A análise manual de editais de fomento é lenta e repetitiva: é preciso abrir cada
PDF, ler o documento inteiro e extrair as informações relevantes. Este sistema
automatiza esse trabalho.

Ele coleta os editais abertos diretamente do site da agência, lê o PDF de cada um,
gera um **resumo estruturado por Inteligência Artificial** (objetivo, área, bolsas,
prazos, perfis de pesquisadores e tags de área) e disponibiliza tudo em uma
interface web. O usuário se cadastra escolhendo suas áreas de interesse e vê em
destaque os editais relevantes para o seu perfil.

**Persona:** equipes de pesquisa e inovação de instituições de ciência e
tecnologia, como o Centro Tecnológico SATC, que precisam acompanhar editais sem
ler cada documento por completo.

## Técnica de IA

A técnica principal é **Modelo Generativo via API (Google Gemini)**.

O texto extraído do PDF do edital é enviado ao modelo junto com um prompt e um
esquema de saída (JSON). O esquema obriga a IA a responder sempre na mesma
estrutura, o que torna o resultado confiável para ser gravado no banco e exibido
na interface. A IA é responsável por gerar o conteúdo apresentado ao usuário
(resumo, classificação por área e perfis sugeridos) — ou seja, ela não é
decorativa: o resultado depende diretamente dela.

Há também uma **alternativa local opcional**, usando o Ollama, implementada em
[`backend/resumo/resumoGemini.py`](backend/resumo/resumoGemini.py)
(`analisar_edital_pdf_ollama`).

## Como funciona

```
Coleta FAPESC (Selenium)
   → Extração de texto do PDF (PyPDF2)
   → Resumo e classificação (Google Gemini)
   → Armazenamento (PostgreSQL)
   → API (FastAPI)
   → Interface (React)
```

O fluxo completo (coleta → resumo → gravação) é orquestrado por
[`backend/pipeline.py`](backend/pipeline.py). Ele pode ser executado diretamente
pelo terminal ou disparado pela interface através do botão **"Buscar novos
editais"**.

> **Nota:** atualmente o pipeline coleta **somente editais da FAPESC**. Os
> coletores de FINEP, CNPq e CAPES existem no código
> ([`backend/scraping/scraping.py`](backend/scraping/scraping.py)), mas não são
> usados pelo pipeline.

Detalhe do pipeline ([`pipeline.py`](backend/pipeline.py)):

1. Abre o PostgreSQL e garante que o schema (`editais`, `usuarios`) existe.
2. Carrega os editais já salvos para **não reprocessar duplicatas**.
3. Faz o **scraping da FAPESC** (Selenium + Chrome headless), retornando editais
   novos e erratas.
4. Descarta editais sem link de PDF e, se `LIMITE_EDITAIS` estiver definido,
   limita a quantidade processada.
5. Para cada edital: baixa o PDF, **resume com o Gemini** e **grava no banco**.
6. Opcionalmente grava os novos no Google Sheets (se `GRAVAR_SHEETS=true`).

## Tecnologias

### Backend (Python 3.12+)

- **FastAPI** + **Uvicorn** — API REST e servidor
- **Selenium** — coleta (web scraping) no site da agência
- **PyPDF2** — extração do texto dos PDFs
- **google-generativeai** — resumo e classificação via Google Gemini
- **psycopg** — acesso ao PostgreSQL
- **Pydantic** — validação dos dados recebidos pela API
- **python-dotenv** — leitura das variáveis de ambiente
- **requests** — download dos PDFs e chamada ao Ollama
- **hashlib** + **secrets** — hash de senha (PBKDF2-SHA256)
- **gspread** + **google-auth** — integração opcional com Google Sheets

### Frontend

- **React 18** + **React Router 7** — interface e navegação entre telas
- **Vite 5** — ambiente de desenvolvimento e build
- **Tailwind CSS 4** — estilização

### Banco de dados

- **PostgreSQL**

## Estrutura de pastas

```
projeto_ediSatc_IA/
├── backend/
│   ├── api/servidor.py         # API FastAPI (endpoints)
│   ├── pipeline.py             # orquestra coleta → resumo → banco
│   ├── scraping/scraping.py    # coletores por agência (Selenium)
│   ├── resumo/resumoGemini.py  # resumo/classificação (Gemini e Ollama)
│   ├── banco/                  # conexão, schema.sql e repositório (PostgreSQL)
│   ├── auth.py                 # hash e verificação de senha
│   ├── config.py               # leitura das variáveis de ambiente
│   ├── planilha/               # integração opcional com Google Sheets
│   ├── frontend/               # interface alternativa em HTML puro
│   └── requirements.txt
├── src/                        # frontend React
│   ├── api/client.js           # cliente HTTP para a API
│   ├── main.jsx                # ponto de entrada
│   └── pages/                  # telas (login, cadastro, dashboard, detalhe)
├── package.json
└── vite.config.js
```

## Pré-requisitos

- **Python 3.10+** (recomendado 3.12+)
- **Node.js 18+**
- **PostgreSQL** instalado e em execução
- **Google Chrome** instalado (necessário para o Selenium)
- **Chave de API do Google Gemini** (https://aistudio.google.com/)

## Configuração

### 1. Banco de dados

Crie o banco com o mesmo nome usado no `DATABASE_URL` (no exemplo abaixo,
`projeto_ia`):

```sql
CREATE DATABASE projeto_ia;
```

As tabelas (`editais` e `usuarios`) são criadas automaticamente na primeira
execução do pipeline.

### 2. Variáveis de ambiente

Crie um arquivo `.env` **dentro da pasta `backend`** com o conteúdo abaixo,
substituindo pelos seus valores. Este arquivo **não deve ser versionado**.

```env
# Obrigatórios
DATABASE_URL=postgresql://usuario:senha@localhost:5432/projeto_ia
GEMINI_API_KEY=sua_chave_do_gemini_aqui
GEMINI_MODELO=gemini-2.5-flash

# Opcional: limita quantos editais o pipeline processa (0 = sem limite)
LIMITE_EDITAIS=1

# Opcional: gravação em Google Sheets (requer credenciais/minha-conta-sheets.json)
GRAVAR_SHEETS=false
PLANILHA_ID=

# Opcional: alternativa local ao Gemini via Ollama
OLLAMA_MODELO=qwen2.5:7b
OLLAMA_NUM_CTX=8192
```

## Como executar

O backend e o frontend rodam em paralelo, em terminais separados. A API precisa
ficar na **porta 8000**, pois o frontend aponta para `http://localhost:8000`
([`src/api/client.js`](src/api/client.js)).

### Backend (primeira vez)

```powershell
# 1. Entre na pasta do backend
cd backend

# 2. Crie o ambiente virtual
python -m venv venv

# 3. Ative o ambiente virtual
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Instale as dependências
pip install -r requirements.txt

# 5. Crie as tabelas e popule o banco pela primeira vez
#    (requer Google Chrome instalado e GEMINI_API_KEY válida)
python pipeline.py

# 6. Inicie o servidor
uvicorn api.servidor:app --reload --port 8000
```

O passo 5 é necessário ao menos uma vez: ele cria as tabelas e traz os primeiros
editais. Sem ele, o login e o cadastro não funcionam, pois a tabela `usuarios`
ainda não existirá. A API ficará disponível em `http://localhost:8000` e a
documentação interativa em `http://localhost:8000/docs`.

> Se o atalho `uvicorn` não for reconhecido, ative o venv antes ou use o Python do
> ambiente diretamente:
> `.\venv\Scripts\python.exe -m uvicorn api.servidor:app --reload --port 8000`
> Em ambos os casos, rode **de dentro da pasta `backend`**.

### Backend (próximas vezes)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn api.servidor:app --reload --port 8000
```

### Frontend

Em outro terminal, com a API já em execução:

```powershell
# 1. Na raiz do projeto, instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

## Como usar

1. Acesse `http://localhost:5173` e faça o cadastro, escolhendo suas áreas de
   interesse.
2. Faça login. O painel mostra os editais já existentes e uma seção de
   recomendados com base no seu perfil.
3. Para coletar novos editais, clique em **"Buscar novos editais"**. A coleta
   (FAPESC) roda em segundo plano; aguarde alguns minutos e atualize a lista.
4. Clique em um edital para ver o detalhamento completo gerado pela IA.

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/editais` | Lista os editais (aceita `?tag=` para filtrar por área) |
| `GET`  | `/editais/{id}` | Detalhes de um edital |
| `POST` | `/pipeline/executar` | Dispara coleta → resumo → gravação em segundo plano (sempre FAPESC) |
| `POST` | `/registrar` | Cadastro de usuário |
| `POST` | `/login` | Autenticação |

> O endpoint `/pipeline/executar` ainda aceita o parâmetro `?fonte=`, mas ele é
> **ignorado**: o pipeline está fixado na FAPESC.

## Limitações e observações

- O pipeline coleta **apenas editais da FAPESC**. Os coletores de FINEP, CNPq e
  CAPES estão implementados, mas dependem do HTML atual desses sites e não são
  usados no fluxo atual.
- A coleta depende de **Selenium (Google Chrome)** e de uma **chave válida do
  Gemini**. PDFs escaneados (apenas imagem, sem texto) não são processados.
- Não versione `backend/.env` nem `backend/credenciais/minha-conta-sheets.json`:
  contêm segredos e já estão no `.gitignore`.
- A pasta `backend/frontend` contém uma interface alternativa em HTML puro,
  servida pela própria API em `http://localhost:8000`. A interface principal é a
  aplicação React em `src/`.
```