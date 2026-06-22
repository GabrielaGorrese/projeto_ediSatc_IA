# API web que lê os editais do banco e entrega em JSON para o front-end.

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from pathlib import Path

from banco.conexao import conectar
from banco import repositorio
from pipeline import executar_pipeline
from auth import gerar_hash, verificar_senha

app = FastAPI(title="API Editais PD&I")

# Libera o front-end a chamar a API (CORS). Em produção, restrinja os domínios.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/editais")
def listar_editais(tag: List[str] = Query(default=[])):
    """Lista os editais. Aceita múltiplos ?tag=... para filtrar por área."""
    conn = conectar()
    try:
        return repositorio.listar_editais(conn, tag or None)
    finally:
        conn.close()


@app.get("/editais/{edital_id}")
def detalhar_edital(edital_id: int):
    """Mostra um edital específico."""
    conn = conectar()
    try:
        edital = repositorio.buscar_edital(conn, edital_id)
        if edital is None:
            raise HTTPException(
                status_code=404, detail="Edital não encontrado")
        return edital
    finally:
        conn.close()


@app.post("/pipeline/executar")
def rodar_pipeline(tarefas: BackgroundTasks, fonte: List[str] = Query(default=[])):
    """Dispara o scraping+resumo+banco em segundo plano para as fontes escolhidas.

    Aceita um ou mais ?fonte=... (FAPESC, FINEP, CNPQ, CAPES). Sem fonte, usa FAPESC.
    """
    tarefas.add_task(executar_pipeline, fonte)
    return {"mensagem": "Pipeline iniciado em segundo plano. Recarregue em alguns minutos."}


class CredenciaisUsuario(BaseModel):
    email: str
    senha: str
    tag: List[str] = []


@app.post("/registrar")
def registrar_usuario(credenciais: CredenciaisUsuario):
    conn = conectar()
    try:
        if repositorio.buscar_usuario(conn, credenciais.email):
            raise HTTPException(status_code=400, detail="Email já registrado.")
        senha_hash = gerar_hash(credenciais.senha)
        novo_id = repositorio.criar_usuario(
            conn, credenciais.email, senha_hash, credenciais.tag)
        return {"id": novo_id, "email": credenciais.email, "tag": credenciais.tag}
    finally:
        conn.close()


@app.post("/login")
def login_usuario(credenciais: CredenciaisUsuario):
    conn = conectar()
    try:
        usuario = repositorio.buscar_usuario(conn, credenciais.email)
        if not usuario or not verificar_senha(credenciais.senha, usuario["senha_hash"]):
            raise HTTPException(
                status_code=401, detail="Credenciais inválidas.")
        return {"id": usuario["id"], "email": usuario["email"], "tag": usuario["tag"]}
    finally:
        conn.close()


PASTA_FRONT = Path(__file__).parent.parent / "frontend"
if PASTA_FRONT.is_dir():
    app.mount("/", StaticFiles(directory=PASTA_FRONT, html=True), name="frontend")
