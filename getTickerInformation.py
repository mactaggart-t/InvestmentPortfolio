from bs4 import BeautifulSoup
from urllib.request import urlopen


def get_security_price(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker + '&.tsrc=fin-srch'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    price = soup.find('div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'}).find('span').text
    return price


def get_sector(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '/profile?p=' + ticker
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    sector = soup.find('p', {'class': 'D(ib) Va(t)'}).find_all('span', {'class': 'Fw(600)'})[0].text
    return sector


def get_industry(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '/profile?p=' + ticker
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    industry = soup.find('p', {'class': 'D(ib) Va(t)'}).find_all('span', {'class': 'Fw(600)'})[1].text
    return industry


def get_name(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '/profile?p=' + ticker
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    name = soup.find('h3', {'class': 'Fz(m) Mb(10px)'}).text
    return name


def ticker_exists(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker + '&.tsrc=fin-srch'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    price = soup.find('div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'})
    if price is None:
        return False
    return True
