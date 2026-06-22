# Conexão com o banco
import psycopg
from config import DATABASE_URL


def conectar():
    conn = psycopg.connect(DATABASE_URL)
    print("Conexão com o banco de dados estabelecida com sucesso!")
    return conn
