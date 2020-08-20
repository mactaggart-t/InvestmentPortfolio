from bs4 import BeautifulSoup
from urllib.request import urlopen
import requests


def get_security_price(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker + '&.tsrc=fin-srch'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    price = soup.find('div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'}).find('span').text
    return price


def get_historic_data(ticker, begin_dt, end_dt):
    dates = []
    close_prices = []
    while begin_dt < end_dt:
        url = 'https://finance.yahoo.com/quote/' + ticker + '/history?period1=' + str(int(begin_dt)) + '&period2=' +\
              str(int(end_dt)) + '&interval=1d&filter=history&frequency=1d'
        page = urlopen(url)
        soup = BeautifulSoup(page, 'html.parser')
        table_body = soup.find('table', {'class': 'W(100%) M(0)'}).find('tbody')
        rows = table_body.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            if len(cols > 2):
                dates.append(cols[0].text)
                close_prices.append(cols[4].text)
        end_dt = end_dt - 8640000
    return dates, close_prices
