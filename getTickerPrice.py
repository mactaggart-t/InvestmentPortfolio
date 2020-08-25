from bs4 import BeautifulSoup
from urllib.request import urlopen
from datetime import datetime, date
import calendar


def get_security_price(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker + '&.tsrc=fin-srch'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    price = soup.find('div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'}).find('span').text
    return price


def get_historic_data(ticker, end_dt, begin_dt=datetime(1980, 1, 1, 0, 0).timestamp()):
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
            if len(cols) > 2:
                cur_date = cols[0].text.replace(',', '').split(' ')
                dates.append(date(int(cur_date[2]), list(calendar.month_abbr).index(cur_date[0]), int(cur_date[1])))
                close_prices.append(cols[4].text)
        end_dt = end_dt - 8640000
        print(end_dt)
    return dates, close_prices
