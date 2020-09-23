from mysql.connector import Error
import pymysql


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


def not_in_db(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT close_price FROM historic_data
                           WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        sec_id = cursor.fetchone()
        try:
            if len(sec_id) > 0:
                sec_id = False
        except TypeError:
            sec_id = True
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return sec_id


def get_unfilled_tickers():
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT distinct sec_id FROM historic_data"""
        sql_insert_query_2 = """SELECT distinct sec_id FROM all_securities"""
        cursor.execute(sql_insert_query)
        sec_id_data = cursor.fetchall()
        cursor.execute(sql_insert_query_2)
        sec_id_list = cursor.fetchall()
        unfilled_list = []
        for i in sec_id_list:
            if i not in sec_id_data:
                unfilled_list.append(get_ticker_from_id(i[0]))
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return unfilled_list


def get_ticker_from_id(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor(prepared=True)
        sql_insert_query = """SELECT ticker FROM all_securities
                           WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        ticker = cursor.fetchone()[0]
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return ticker


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
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return all_tickers