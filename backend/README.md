# PROJETO | GESTÃO DE PD&I

<b>Desenvolvido por Bruno Pagani Rampinelli</b></br>
Sistema de Web Scraping com alimentação automática de planilhas Google Sheets.
<br><br>
![image](complementos/charter.png)

## FUNCIONALIDADES

- Busca automatizada por editais FAPESC e FINEP
  - Com possibilidade de acréscimo de outras organizações
  - Filtro automático de duplicatas
  - Tratamento adequado de erratas
- Cadastro na [planilha central](https://docs.google.com/spreadsheets/d/1lqGcb_OR0fyM7fCaadu4y-wtZJrzdLvbpPRQCZNRDBU/edit?gid=1539231358#gid=1539231358)
  - Com prazos, título, link para página, link para edital, etc
- Envio automático de e-mails perante alterações na planilha
- Arquivamento automático de editais vencidos

## TECNOLOGIAS
- Python 3.14.2
- Google Cloud: APIs para Google Sheets e Gmail
- Bibliotecas gspread e selenium

## COMO EXECUTAR

### PRIMEIRA VEZ
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python projeto-pdi\main.py
```

### PRÓXIMAS VEZES
```
venv\Scripts\activate
python projeto-pdi\main.py
```
