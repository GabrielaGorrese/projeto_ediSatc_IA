from pathlib import Path
from psycopg.rows import dict_row
from psycopg.types.json import Json


# criar tabela


def criar_schema(conn):
    sql = (Path(__file__).parent / 'schema.sql').read_text(encoding='utf-8')
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()


# Listar editais

def listar_para_dedup(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT titulo, edital_link FROM editais")
        linhas = cur.fetchall()
    # o scraping espera as chaves: titulo, editalLink, linha
    return [{"titulo": t, "editalLink": link, "linha": 0} for (t, link) in linhas]


def _extrair_tag(r):
    tags = r.get("tags") or r.get("tag")
    if isinstance(tags, list):
        return tags[0] if tags else None
    return tags


def _extrair_custos(r):
    if r.get("custos_e_lucros_ou_bolsas"):
        return r["custos_e_lucros_ou_bolsas"]
    partes = [p for p in [r.get("custos"), r.get("bolsas")] if p]
    return " | ".join(partes) if partes else None


def _extrair_prazos(r):
    prazos = r.get("prazos")
    if isinstance(prazos, dict):
        partes = [
            f"Abertura: {prazos.get('abertura_submissoes', '')}",
            f"Limite: {prazos.get('limite_submissoes', '')}",
            f"Resultado: {prazos.get('divulgacao_resultados', '')}",
        ]
        return " | ".join(p for p in partes if p.split(": ", 1)[1])
    return prazos


def inserir_edital(conn, edital, resumo):
    r = {}
    if isinstance(resumo, dict) and "resumo_edital" in resumo:
        r = resumo["resumo_edital"]
    sql = """
        INSERT INTO editais(
            titulo, organizacao, prazo_inicial, prazo_final, pagina_link, edital_link,
            resumo, objetivo_principal, area_atuacao, tag, pesquisadores_necessarios,
            custos_e_lucros_ou_bolsas, resumo_prazos, outras_informacoes_relevantes,
            resumo_completo, data_resumo
        ) VALUES(
            %(titulo)s, %(organizacao)s, %(prazo_inicial)s, %(prazo_final)s,
            %(pagina_link)s, %(edital_link)s,
            %(resumo)s, %(objetivo)s, %(area)s, %(tag)s, %(pesquisadores)s,
            %(custos)s, %(prazos)s, %(outras)s,
            %(completo)s, NOW()
        )
        ON CONFLICT(edital_link) DO NOTHING
        RETURNING id;
    """
    params = {
        "titulo": edital["titulo"],
        "organizacao": edital["organizacao"],
        "prazo_inicial": edital["prazo_inicial"],
        "prazo_final": edital["prazo_final"],
        "pagina_link": edital["pagina_link"],
        "edital_link": edital["edital_link"],
        "resumo": r.get("resumo"),
        "objetivo": r.get("objetivo_principal"),
        "area": r.get("area_atuacao"),
        "tag": _extrair_tag(r),
        "pesquisadores": Json(r.get("pesquisadores_necessarios")),
        "custos": _extrair_custos(r),
        "prazos": _extrair_prazos(r),
        "outras": r.get("outras_informacoes_relevantes"),
        "completo": Json(resumo) if isinstance(resumo, dict) else None,
    }

    with conn.cursor() as cur:
        cur.execute(sql, params)
        linha = cur.fetchone()
    conn.commit()
    return linha[0] if linha else None


def listar_editais(conn, tags=None):
    with conn.cursor(row_factory=dict_row) as cur:
        if tags:
            cur.execute(
                "SELECT * FROM editais WHERE tag = ANY(%s) OR tag = 'Outros' ORDER BY id DESC",
                (tags,),
            )
        else:
            cur.execute("SELECT * FROM editais ORDER BY id DESC")
        return cur.fetchall()


def buscar_edital(conn, edital_id):

    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute("SELECT * FROM editais WHERE id = %s", (edital_id,))
        return cur.fetchone()


def criar_usuario(conn, email, senha_hash, tags):
    tags_validas = {
        "Inovação", "Empreendedorismo", "Biotecnologia", "Sustentabilidade",
        "Industrial", "Marketing", "Computação", "Mecânica", "Elétrica",
    }
    invalidas = [t for t in tags if t not in tags_validas]
    if invalidas:
        raise ValueError(f"Tags inválidas: {invalidas}")
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO usuarios (email, senha_hash, tag) VALUES (%s, %s, %s) RETURNING id",
            (email, senha_hash, tags),
        )
        novo_id = cur.fetchone()[0]
    conn.commit()
    return novo_id


def buscar_usuario(conn, email):
    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        return cur.fetchone()
