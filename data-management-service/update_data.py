import pymysql
from datetime import datetime, date, timedelta
import pandas as pd
import yfinance as yf


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
    except:
        print("parameterized query failed")
    finally:
        cursor.close()
        connection_hosted.close()
    return all_tickers


def manage_updates():
    for i in get_all_tickers():
        print(i)
        begin_dt = datetime.fromtimestamp(get_most_recent_dt(get_security_id(i)))
        begin_dt_str = begin_dt.strftime("%Y-%m-%d")
        today_dt = datetime.today().strftime("%Y-%m-%d")
        data = yf.download(i, start=begin_dt_str, end=today_dt)
        prices = data['Adj Close'].to_list()
        dates = list(data.index.values)
        if len(dates) == 1 and pd.to_datetime(dates[0]).to_pydatetime().date() < begin_dt.date():
            continue
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
            most_recent = date(2000, 1, 1)
            for i in data:
                if isinstance(i[0], str):
                    continue
                if i[0] > most_recent:
                    most_recent = i[0]
            most_recent = datetime.combine(most_recent + timedelta(days=1), datetime.min.time()).timestamp()
        except TypeError:
            most_recent = datetime(2000, 1, 1, 0, 0).timestamp()
        cursor.close()
        connection_hosted.close()
        return most_recent
    except:
        print("parameterized query failed")
    finally:
        print("MySQL connection is closed")


def add_historic_price(sec_id, prices, dates):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        records_to_insert = []
        for i in range(0, len(prices)):
            records_to_insert.append((sec_id, pd.to_datetime(dates[i]).to_pydatetime().date(), prices[i]))
        sql_insert_query = """INSERT INTO historic_data
                           (sec_id, record_dt, close_price) VALUES (%s,%s,%s)"""

        cursor.executemany(sql_insert_query, records_to_insert)
        connection_hosted.commit()
        print("Data inserted successfully table")

    except:
        print("parameterized query failed")
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
    except:
        print("parameterized query failed")
    finally:
        cursor.close()
        connection_hosted.close()
    return sec_id


if __name__ == '__main__':
    manage_updates()
