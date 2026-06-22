CREATE TABLE IF NOT EXISTS editais (
    id              SERIAL PRIMARY KEY,         

    
    titulo          TEXT NOT NULL,
    organizacao     TEXT NOT NULL,
    prazo_inicial   TEXT,
    prazo_final     TEXT,
    pagina_link     TEXT,
    edital_link     TEXT UNIQUE,              
    data_coleta     DATE DEFAULT CURRENT_DATE,

   
    resumo                          TEXT,
    objetivo_principal              TEXT,
    area_atuacao                    TEXT,
    tag                             TEXT,
    pesquisadores_necessarios       JSONB,
    custos_e_lucros_ou_bolsas       TEXT,
    resumo_prazos                   TEXT,
    outras_informacoes_relevantes   TEXT,
    resumo_completo                 JSONB,
    data_resumo                     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,   
    senha_hash  TEXT NOT NULL,
    TAG         TEXT[],
    criado_em   TIMESTAMP DEFAULT NOW()
);