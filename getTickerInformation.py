from bs4 import BeautifulSoup
from urllib.request import urlopen
from datetime import datetime, date
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import calendar
import time
import sys
from sys import platform


def get_security_price(ticker):
    url = 'https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker + '&.tsrc=fin-srch'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    price = soup.find('div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'}).find('span').text
    return price


def get_historic_data(ticker, end_dt, begin_dt=datetime(1980, 1, 1, 0, 0).timestamp()):
    dates = []
    close_prices = []
    if platform == "linux":
        chromedriver = os.path.join(sys.path[0], 'chromedriver 2 linux')
    elif platform == "darwin":
        chromedriver = os.path.join(sys.path[0], 'chromedriver 2 mac')
    else:
        chromedriver = os.path.join(sys.path[0], 'chromedriver.exe')
    chrome_path = os.path.join(sys.path[0], 'Google Chrome')
    os.environ["webdriver.chrome.driver"] = chromedriver
    options = Options()
    options.headless = True
    options.binary_location = chrome_path
    driver = webdriver.Chrome(executable_path=chromedriver, options=options)
    url = 'https://finance.yahoo.com/quote/' + ticker + '/history?period1=' + str(int(begin_dt)) + '&period2=' + \
          str(int(end_dt)) + '&interval=1d&filter=history&frequency=1d'
    num_scrolls = int((end_dt-begin_dt)/(86400*50))
    driver.get(url)
    time.sleep(1)
    for i in range(0, num_scrolls):
        driver.execute_script("window.scrollTo(1,1000000)")
        time.sleep(.05)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    table_body = soup.find('table', {'class': 'W(100%) M(0)'}).find('tbody')
    rows = table_body.find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        if len(cols) > 2 and cols[4].text != '-':
            cur_date = cols[0].text.replace(',', '').split(' ')
            dates.append(date(int(cur_date[2]), list(calendar.month_abbr).index(cur_date[0]), int(cur_date[1])))
            close_prices.append(cols[4].text.replace(',', ''))
    driver.close()
    return dates, close_prices


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
