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

        cursor = connection_hosted.cursor()
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


def get_name_from_id(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT sec_name FROM all_securities
                           WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        name = cursor.fetchone()[0]
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return name


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


def get_purchase(user_id, sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT price, user_id, shares, buyOrSell FROM portfolios
                           WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        prices = cursor.fetchall()
        purchase_price = 0
        total_purchase = 0
        shares = 0
        for i in prices:
            if i[1] == user_id and i[3] == 1:
                total_purchase = i[0] * i[2] + total_purchase
                shares = shares + i[2]
            if i[1] == user_id and i[3] == 0:
                total_purchase = total_purchase - i[0] * i[2]
                shares = shares - i[2]
        if shares == 0:
            purchase_price = 0
        else:
            purchase_price = total_purchase/shares
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return purchase_price, shares


def get_price_today(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT close_price, record_dt FROM historic_data
                           WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        all_prices = cursor.fetchall()
        today_price = all_prices[0][0]
        latest_dt = all_prices[0][1]
        for i in all_prices:
            if i[1] > latest_dt:
                today_price = i[0]
                latest_dt = i[1]
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return today_price


def get_purchases(user_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT price, record_dt, buyOrSell, shares FROM portfolios
                           WHERE user_id = %s"""
        cursor.execute(sql_insert_query, (user_id,))
        all_prices = list(cursor.fetchall())
        sorted_prices = []
        aplen = len(all_prices)
        for i in range(0, aplen):
            min_elem = all_prices[0]
            for j in all_prices:
                if j[1] < min_elem[1]:
                    min_elem = j
            sorted_prices.append(min_elem)
            all_prices.remove(min_elem)
        total_purchase = []
        for i in sorted_prices:
            if i[2] == 1:
                try:
                    if total_purchase[-1]['date'] == i[1]:
                        total_purchase[-1] = ({'date': i[1],
                                              'price': total_purchase[-1]['price'] + i[0] * i[3]})
                    else:
                        total_purchase.append({'date': i[1],
                                               'price': i[0] * i[3]})
                except IndexError:
                    total_purchase.append({'date': i[1],
                                           'price': i[0] * i[3]})
            else:
                if total_purchase[-1]['date'] == i[1]:
                    total_purchase[-1] = ({'date': i[1],
                                          'price': total_purchase[-1]['price'] - i[0] * i[3]})
                else:
                    total_purchase.append({'date': i[1],
                                           'price': -i[0] * i[3]})

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
    return total_purchase


def get_sector_from_id(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT sector FROM all_securities
                           WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        sector = cursor.fetchone()[0]
        cursor.close()
        connection_hosted.close()
        return sector
    except Error as error:
        print("parameterized query failed {}".format(error))


def get_tickers_from_ids(sec_id_list):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT ticker, sec_name, sector FROM all_securities
                           WHERE sec_id = %s"""
        ticker_list = []
        sector_list = []
        security_list = []
        for i in sec_id_list:
            cursor.execute(sql_insert_query, (i,))
            item_data = cursor.fetchone()
            ticker_list.append(item_data[0])
            sector_list.append(sector_conversion(item_data[2]))
            security_list.append(item_data[1])
        cursor.close()
        connection_hosted.close()
        return ticker_list, sector_list, security_list
    except Error as error:
        print("parameterized query failed {}".format(error))


def sector_conversion(argument):
    switcher = {
        'Communication Services': 'Communication Services',
        'Communication Services\n': 'Communication Services',
        'Consumer Cyclical': 'Consumer Cyclical',
        'Consumer Defensive': 'Consumer Defensive',
        'Consumer Discretionary': 'Consumer Defensive',
        'Consumer Staples': 'Consumer Cyclical',
        'Energy': 'Energy',
        'Financial Services': 'Financials',
        'Financials': 'Financials',
        'Health Care': 'Healthcare',
        'Healthcare': 'Healthcare',
        'Industrials': 'Industrials',
        'Information Technology': 'Information Technology',
        'Materials': 'Materials',
        'Real Estate': 'Real Estate',
        'Technology': 'Information Technology',
        'Utilities': 'Utilities'
    }
    return switcher.get(argument, "Other")
