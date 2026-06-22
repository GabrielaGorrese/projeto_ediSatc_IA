# faz webscraping de páginas específicas (fapesc e finep) e lista editais encontrados, coletando dados

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

from datetime import datetime, date

import re

# configura driver selenium para chrome


def conectarWebDriver():
    service = Service()

    options = Options()
    # torna a página invisível. para ver o scraping em ação, basta comentar essa linha
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=service, options=options)
    return driver

# site fapesc


def scrapingFAPESC(editaisCadastrados):
    try:
        print(" \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n")
        print("\n--------------------\nConexão: Site FAPESC\n--------------------\n")

        print("Carregando...")

        resultadosFAPESC = []
        erratasFAPESC = []

        driver = conectarWebDriver()
        # conecta ao site
        driver.get("https://fapesc.sc.gov.br/chamadas-abertas/")
        driver.implicitly_wait(10)

        # encontra todos os editais cadastrados
        links = driver.find_elements(
            By.XPATH, "//a[contains(translate(text(), 'EDITAL', 'edital'), 'edital')]")
        urls = [link.get_attribute("href")
                for link in links if link.get_attribute("href")]

        # acessa cada edital para coletar dados
        for i, url in enumerate(urls, start=1):
            print(f"\n | [{i}/{len(urls)}] Acessando edital [{url[:60]}]...")

            pularURL = False

            try:
                driver.get(url)
                driver.implicitly_wait(10)

                try:
                    # coleta prazos (início e fim)
                    prazos = driver.find_element(
                        By.XPATH, "//p[contains(text(), 'Prazo')]").text

                    # trata dados
                    padrao = r'\b\d{2}/\d{2}/\d{4}\b'
                    datas = re.findall(padrao, prazos)

                    i = 0

                    # caso não tiver data de início, preenche como dado faltante ("--")
                    if len(datas) < 2:
                        prazoInicial = "--"
                        prazoFinal = datas[i]
                    else:
                        while i < 2:
                            if i == 0:
                                prazoInicial = datas[i]
                            elif i == 1:
                                prazoFinal = datas[i]
                            i += 1

                except Exception as e:
                    prazoInicial = "--"
                    prazoFinal = "--"

                if prazoFinal != "--":
                    if datetime.strptime(prazoFinal, "%d/%m/%Y").date() < date.today():
                        print(" Edital vencido! Avançando...")
                        continue

                # coleta pdf
                linkEdital = driver.find_element(
                    By.XPATH, "//a[contains(., 'EDITAL COMPLETO')]").get_attribute("href")

                # coleta titulo
                titulo = driver.find_element(By.TAG_NAME, "h1").text

                for edital in editaisCadastrados:
                    # busca duplicatas
                    if edital["editalLink"] == linkEdital and edital["titulo"].casefold() == titulo.casefold():
                        print(f"Edital já cadastrado! Avançando...")
                        pularURL = True
                        break
                    # busca erratas
                    elif edital["editalLink"] != linkEdital and edital["titulo"] == titulo:
                        print(f"Errata encontrada! Anotando...")
                        errata = {
                            "link": linkEdital,
                            "titulo": titulo,
                            "linha": edital['linha']
                        }
                        erratasFAPESC.append(errata)
                        continue

                if pularURL == True:
                    continue

                organizacao = "FAPESC"

                resultado = {
                    "titulo": titulo,
                    "organizacao": organizacao,
                    "prazo_inicial": prazoInicial,
                    "prazo_final": prazoFinal,
                    "pagina_link": url,
                    "edital_link": linkEdital
                }

                print("Edital encontrado com sucesso!")
                # acrescenta à lista para adição na planilha
                resultadosFAPESC.append(resultado)

            except Exception as e:
                print(f"Erro ao acessar edital: {e}")
                continue

        print("\nColeta de editais FAPESC concluída com sucesso!")
        return resultadosFAPESC, erratasFAPESC

    except WebDriverException as e:
        print(f"Erro ao acessar site da FAPESC: {e}")

    finally:
        driver.quit()

# site finep


def scrapingFINEP(editaisCadastrados):
    try:
        print(" \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n")
        print("\n-------------------\nConexão: Site FINEP\n-------------------\n")

        print("Carregando...")

        resultadosFINEP = []
        erratasFINEP = []
        urls = []

        driver = conectarWebDriver()
        driver.set_page_load_timeout(20)
        driver.get(
            "http://www.finep.gov.br/chamadas-publicas/chamadaspublicas?situacao=aberta")
        driver.implicitly_wait(10)

        chamadas = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.item"))
        )

        # coleta dados dos editais
        for chamada in chamadas:
            try:
                prazoDiv = chamada.find_element(
                    By.XPATH,
                    ".//div[.//strong[contains(normalize-space(.), 'Prazo para envio de propostas')]]"
                )

                # verifica prazo
                prazoTexto = prazoDiv.find_element(
                    By.TAG_NAME, "span").text.strip()
                prazoFormatado = datetime.strptime(
                    prazoTexto, "%d/%m/%Y").date()

                # verifica vencimento
                if prazoFormatado >= date.today():
                    link = chamada.find_element(By.CSS_SELECTOR, "h3 a")
                    url = link.get_attribute("href")
                    if url.startswith("/"):
                        url = "http://www.finep.gov.br" + url
                    urls.append(url)

            except Exception as e:
                continue

        # acessa editais para coletar dados
        for i, url in enumerate(urls, start=1):
            print(f"\n🔄 | [{i}/{len(urls)}] Acessando edital [{url[:60]}]...")

            pularURL = False

            try:
                driver.get(url)
                driver.implicitly_wait(10)

                # coleta link do pdf e título
                linhas = driver.find_elements(By.XPATH, "//tbody/tr")

                linkEdital = None

                for i, linha in enumerate(linhas, start=1):
                    try:
                        href = linha.find_element(
                            By.XPATH, "./td[3]//a").get_attribute("href")

                        if href and "www.finep.gov.br" in href:
                            linkEdital = href
                            break

                    except Exception:
                        continue

                if linkEdital is None:
                    print("Nenhum link da FINEP encontrado na tabela.")

                titulo = driver.find_element(By.CSS_SELECTOR, "h2 a").text

                for edital in editaisCadastrados:
                    # busca duplicatas
                    if edital["editalLink"] == linkEdital and edital["titulo"] == titulo:
                        print(f"Edital já cadastrado! Avançando...")
                        pularURL = True
                        break
                    # busca erratas
                    elif edital["editalLink"] != linkEdital and edital["titulo"] == titulo:
                        print(f"Errata encontrada! Anotando...")
                        errata = {
                            "link": linkEdital,
                            "titulo": titulo,
                            "linha": edital['linha']
                        }
                        erratasFINEP.append(errata)
                        continue

                if pularURL == True:
                    continue

                organizacao = "FINEP"

                grupos = driver.find_elements(By.CSS_SELECTOR, "div.group")

                # coleta prazos (início e fim)
                for grupo in grupos:
                    tit_elems = grupo.find_elements(By.CSS_SELECTOR, "div.tit")
                    text_elems = grupo.find_elements(
                        By.CSS_SELECTOR, "div.text")

                    if not tit_elems or not text_elems:
                        continue

                    tit = tit_elems[0].text.strip().lower()
                    text = text_elems[0].text.strip()

                    if "data de publicação" in tit:
                        prazoInicial = text
                    elif "prazo para envio" in tit:
                        prazoFinal = text

                resultado = {
                    "titulo": titulo,
                    "organizacao": organizacao,
                    "prazo_inicial": prazoInicial,
                    "prazo_final": prazoFinal,
                    "pagina_link": url,
                    "edital_link": linkEdital
                }

                print("Edital encontrado com sucesso!")
                resultadosFINEP.append(resultado)

            except Exception as e:
                print(f"Erro ao acessar. {e}")
                continue

        print("\n Coleta de editais FINEP concluída com sucesso!")
        return resultadosFINEP, erratasFINEP

    except WebDriverException as e:
        print("Erro ao acessar site FINEP.")
        driver.quit()
        return [], []


def scrapingCNPQ(editaisCadastrados):
    try:
        print(" \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n")
        print("\n-------------------\nConexão: Site CNPQ\n-------------------\n")

        print("Carregando...")

        resultadosCNPQ = []
        erratasCNPQ = []

        driver = conectarWebDriver()
        driver.set_page_load_timeout(30)

        try:
            driver.get("http://memoria2.cnpq.br/web/guest/chamadas-publicas")
        except:
            print("Erro ao acessar: CNPQ")

        import time
        time.sleep(5)

        WebDriverWait(driver, 60).until(
            lambda d: d.execute_script(
                "return document.readyState") == "complete"
        )

        chamadas = WebDriverWait(driver, 60).until(
            EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, "li[tabindex='0']"))
        )

        titulos = []
        linksEdital = []

        for edital in editaisCadastrados:
            titulos.append(edital["titulo"])
            linksEdital.append(edital["editalLink"])

        # coleta dados dos editais
        for i, chamada in enumerate(chamadas, start=1):
            print(
                f"\n[{i}/{len(chamadas)}] Acessando edital [{chamada.text[:60]}]...")
            try:
                titulo = WebDriverWait(chamada, 10).until(
                    lambda el: el.find_element(By.TAG_NAME, "h4")
                ).text

                linkEditalA = chamada.find_element(
                    By.CSS_SELECTOR, 'a[alt="Chamada"]')
                linkEdital = linkEditalA.get_attribute("href")

                pularURL = False

                if linkEdital in linksEdital and titulo in titulos:
                    print(f"Edital já cadastrado! Avançando...")
                    pularURL = True
                    break
                # busca erratas
                elif linkEdital not in linksEdital and titulo in titulos:
                    print(f"Errata encontrada! Anotando...")
                    errata = {
                        "link": linkEdital,
                        "titulo": titulo,
                        "linha": edital['linha']
                    }
                    erratasCNPQ.append(errata)
                    continue

                if pularURL == True:
                    continue

                prazos = chamada.find_element(
                    By.CSS_SELECTOR, "ul.datas li:nth-child(1)").text
                prazoInicial = prazos[:10]
                prazoFinal = prazos[13:]

                linkWebDiv = chamada.find_element(
                    By.CSS_SELECTOR, "div.controls input")
                url = linkWebDiv.get_attribute("value")

                organizacao = "CNPQ"

            except Exception as e:
                print(e)
                continue

            resultado = {
                "titulo": titulo,
                "organizacao": organizacao,
                "prazo_inicial": prazoInicial,
                "prazo_final": prazoFinal,
                "pagina_link": url,
                "edital_link": linkEdital
            }

            print("Edital encontrado com sucesso!")
            resultadosCNPQ.append(resultado)

        print("\noleta de editais CNPQ concluída com sucesso!")
        return resultadosCNPQ, erratasCNPQ

    except WebDriverException as e:
        print("Erro ao acessar site CNPQ.")
        driver.quit()
        return [], []


def scrapingCAPES(editaisCadastrados):
    try:
        print(" \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n")
        print("\n-------------------\nConexão: Site CAPES\n-------------------\n")

        print("Carregando...")

        resultadosCAPES = []
        erratasCAPES = []
        urls = []

        driver = conectarWebDriver()
        driver.set_page_load_timeout(20)
        driver.get(
            "https://www.gov.br/capes/pt-br/assuntos/editais-e-resultados-capes")
        driver.implicitly_wait(5)

        div = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "div.cover-richtext-tile.tile-content")
            )
        )

        chamadas = div.find_elements(By.TAG_NAME, "a")

        # coleta dados dos editais
        for chamada in chamadas:
            try:
                url = chamada.get_attribute("href")
                urls.append(url)

            except Exception as e:
                continue

        # acessa editais para coletar dados
        for i, url in enumerate(urls, start=1):
            print(f"\n[{i}/{len(urls)}] Acessando edital [{url[60:]}]...")

            pularURL = False

            try:
                driver.get(url)

                try:
                    linkEdital = driver.find_element(
                        By.XPATH,
                        "//tbody//a[starts-with(normalize-space(text()), 'Edital')]"
                    ).get_attribute("href")
                except:
                    linkEdital = None

                if linkEdital is None:
                    print("Nenhum link da CAPES encontrado na tabela.")

                titulo = driver.find_element(
                    By.CSS_SELECTOR, "h1.documentFirstHeading").text

                for edital in editaisCadastrados:
                    # busca duplicatas
                    if edital["editalLink"] == linkEdital and edital["titulo"] == titulo:
                        print(f"Edital já cadastrado! Avançando...")
                        pularURL = True
                        break
                    # busca erratas
                    elif edital["editalLink"] != linkEdital and edital["titulo"] == titulo:
                        print(f"Errata encontrada! Anotando...")
                        errata = {
                            "link": linkEdital,
                            "titulo": titulo,
                            "linha": edital['linha']
                        }
                        erratasCAPES.append(errata)
                        continue

                if pularURL == True:
                    continue

                organizacao = "CAPES"

                # prazos
                # parent-fieldname-text
                '''li_data_limite = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((
                        By.XPATH,
                        "//div[@id='parent-fieldname-text']//li[starts-with(normalize-space(), 'Data limite para submissão')]"
                    ))
                ).text

                print(li_data_limite)'''

                prazoInicial = '--'
                prazoFinal = '--'

                resultado = {
                    "titulo": titulo,
                    "organizacao": organizacao,
                    "prazo_inicial": prazoInicial,
                    "prazo_final": prazoFinal,
                    "pagina_link": url,
                    "edital_link": linkEdital
                }

                print("Edital encontrado com sucesso!")
                resultadosCAPES.append(resultado)

            except Exception as e:
                print(f"Erro ao acessar. {e}")
                continue

        print("\n✅ | Coleta de editais CAPES concluída com sucesso!")
        return resultadosCAPES, erratasCAPES

    except WebDriverException as e:
        print("Erro ao acessar site FINEP.")
        driver.quit()
        return [], []
