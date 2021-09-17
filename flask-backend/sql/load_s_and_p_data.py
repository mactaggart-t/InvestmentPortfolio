from bs4 import BeautifulSoup
from urllib.request import urlopen


def get_all_s_and_p():
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    table_body = soup.find('table', {'id': 'constituents'}).find('tbody')
    rows = table_body.find_all('tr')
    tickers = []
    names = []
    sector = []
    industry = []
    for row in rows:
        cols = row.find_all('td')
        if len(cols) > 0:
            tickers.append(cols[0].text.replace('\n', ''))
            names.append(cols[1].text)
            sector.append(cols[3].text)
            industry.append(cols[4].text)
    return tickers, names, sector, industry


