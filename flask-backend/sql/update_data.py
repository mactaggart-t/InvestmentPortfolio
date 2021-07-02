from mysql.connector import Error
import pymysql
from bs4 import BeautifulSoup
from urllib.request import urlopen
from datetime import datetime, date, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import SessionNotCreatedException
import os
import calendar
import time
import sys
from sys import platform


def get_all_tickers():
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT ticker FROM all_securities"""

        cursor.execute(sql_insert_query)
        tickers = cursor.fetchall()
        all_tickers = []
        for i in tickers:
            all_tickers.append(i[0])
        cursor.close()
        connection_hosted.close()
        return all_tickers
    except Error as error:
        print("parameterized query failed {}".format(error))


def get_all_s_and_p():
    url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    table_body = soup.find('table', {'id': 'constituents'}).find('tbody')
    rows = table_body.find_all('tr')
    tickers = []
    for row in rows:
        cols = row.find_all('td')
        if len(cols) > 0:
            tickers.append(cols[0].text.replace('\n', ''))
    return tickers


def manage_intraday_updates():
    all_s_p = get_all_s_and_p()
    for i in get_all_tickers():
        in_sp = i in all_s_p
        record_dt = datetime.today()
        change_dollar, change_percent, market_cap, current_price = get_intraday_data(i)
        replace_data(get_security_id(i), change_dollar, change_percent, market_cap, current_price, record_dt, in_sp)


def get_intraday_data(ticker):
    print(ticker)
    url = 'https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker + '&.tsrc=fin-srch'
    page = urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    changes = soup.find('span', {'data-reactid': '51'}).text.split(" ")
    change_dollar = float(changes[0].replace("+", ""))
    change_percent = float(changes[1].replace("(", "").replace("%", "").replace(")", "").replace("+", ""))
    market_cap = calc_market_cap(soup.find('span', {'data-reactid': '139'}).text)
    current_price = float(soup.find('span', {'data-reactid': '50'}).text)
    return change_dollar, change_percent, market_cap, current_price


def calc_market_cap(mk_str):
    last_char = mk_str[-1]
    if last_char == 'T':
        val = float(mk_str[:-1]) * 1000000000000
    elif last_char == 'B':
        val = float(mk_str[:-1]) * 1000000000
    else:
        val = float(mk_str[:-1]) * 1000000
    return val


def replace_data(sec_id, change_dollar, change_percent, market_cap, current_price, record_dt, in_sp):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_delete_query = """DELETE FROM today_data WHERE sec_id = %s"""
        sql_insert_query = """INSERT INTO today_data
                           (sec_id, change_dollar, change_percent, market_cap, current_price, record_dt, in_s_p)
                            VALUES (%s,%s,%s,%s,%s,%s,%s)"""
        cursor.execute(sql_delete_query, sec_id)
        cursor.executemany(sql_insert_query, [(sec_id, change_dollar, change_percent, market_cap, current_price,
                                              record_dt, in_sp)])
        connection_hosted.commit()
        print("Data inserted successfully table")
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
    except Error as error:
        print("parameterized query failed {}".format(error))


def manage_updates():
    for i in get_all_tickers():
        print(i)
        dates, prices = get_historic_data(i, datetime.today().timestamp(),
                                          get_most_recent_dt(get_security_id(i)))
        add_historic_price(get_security_id(i), prices, dates)


def get_most_recent_dt(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT DISTINCT record_dt FROM historic_data
                           WHERE sec_id = %s"""

        cursor.executemany(sql_insert_query, (sec_id,))
        try:
            data = cursor.fetchall()
            most_recent = (max(data) + timedelta(days=1)).timestamp()
        except TypeError:
            most_recent = datetime(2000, 1, 1, 0, 0).timestamp()
        cursor.close()
        connection_hosted.close()
        return most_recent
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        print("MySQL connection is closed")


def get_historic_data(ticker, end_dt, begin_dt=datetime(1980, 1, 1, 0, 0).timestamp()):
    dates = []
    close_prices = []
    try:
        if platform == "linux":
            chromedriver = os.path.join(sys.path[0], 'chromedriver/chromedriver 2 linux')
        elif platform == "darwin":
            chromedriver = os.path.join(sys.path[0], 'chromedriver/chromedriver 3')
        else:
            chromedriver = os.path.join(sys.path[0], 'chromedriver/chromedriver.exe')
        os.environ["webdriver.chrome.driver"] = chromedriver
        options = Options()
        options.headless = True
        driver = webdriver.Chrome(executable_path=chromedriver, options=options)
        url = 'https://finance.yahoo.com/quote/' + ticker + '/history?period1=' + str(int(begin_dt)) + '&period2=' + \
              str(int(end_dt)) + '&interval=1d&filter=history&frequency=1d'
        num_scrolls = int((end_dt-begin_dt)/(86400*50))
        driver.get(url)
    except SessionNotCreatedException:
        if platform == "linux":
            chromedriver = os.path.join(sys.path[0], 'chromedriver/chromedriver linux 85')
        elif platform == "darwin":
            chromedriver = os.path.join(sys.path[0], 'chromedriver/chromedriver mac 85')
        else:
            chromedriver = os.path.join(sys.path[0], 'chromedriver/chromedriver win 85.exe')
        os.environ["webdriver.chrome.driver"] = chromedriver
        options = Options()
        options.headless = True
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


def add_historic_price(sec_id, prices, dates):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        records_to_insert = []
        for i in range(0, len(prices)):
            records_to_insert.append((sec_id, dates[i], prices[i]))
        sql_insert_query = """INSERT INTO historic_data
                           (sec_id, record_dt, close_price) VALUES (%s,%s,%s)"""

        cursor.executemany(sql_insert_query, records_to_insert)
        connection_hosted.commit()
        print("Data inserted successfully table")

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")


def get_security_id(ticker):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT sec_id FROM all_securities
                           WHERE ticker = %s"""

        cursor.execute(sql_insert_query, (ticker,))
        try:
            sec_id = cursor.fetchone()[0]
        except TypeError:
            sec_id = None
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return sec_id
