from mysql.connector import Error
from datetime import datetime, date
import pymysql


def check_valid_sell(shares, sec_id, username_id, sell_dt):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT * FROM portfolios WHERE user_id = %s"""

        cursor.executemany(sql_insert_query, (username_id,))
        all_transactions = cursor.fetchall()
        bought_shares = 0
        sold_shares = 0
        for i in all_transactions:
            if i[2] == sec_id and bool(i[6]):
                bought_shares = bought_shares + i[5]
            elif i[2] == sec_id and not bool(i[6]):
                sold_shares = sold_shares + i[5]
        return bought_shares >= sold_shares + shares
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")


def add_purchase(sec_id, user_id, record_dt, price, buy, shares):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """INSERT INTO portfolios (user_id, sec_id, record_dt, price, buyOrSell, shares) 
        VALUES (%s, %s, %s, %s, %s, %s)"""

        cursor.executemany(sql_insert_query, [(user_id, sec_id, record_dt, price, int(buy), shares)])
        connection_hosted.commit()
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")


def get_port_secs(user_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT DISTINCT sec_id FROM portfolios WHERE user_id = %s"""

        cursor.executemany(sql_insert_query, (user_id,))
        result = cursor.fetchall()
        all_ids = []
        for i in result:
            all_ids.append(i[0])
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return all_ids


def get_adjusted_price(price, date, num_shares):
    for i in range(0, len(num_shares)):
        if date < num_shares[i]['date']:
            return price * num_shares[i-1]['shares']
    return 0


def add_value(sec_id, user_id, start_dt, portfolio_value):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT * FROM portfolios WHERE user_id = %s"""

        cursor.executemany(sql_insert_query, (user_id,))
        all_transactions = cursor.fetchall()
        num_shares = [{'date': start_dt, 'shares': 0}]
        for i in all_transactions:
            if i[2] == sec_id and bool(i[6]):
                cur_shares = num_shares[-1]['shares']
                num_shares.append({'date': i[3], 'shares': cur_shares + i[5]})
            elif i[2] == sec_id and not bool(i[6]):
                cur_shares = num_shares[-1]['shares']
                num_shares.append({'date': i[3], 'shares': cur_shares - i[5]})
        num_shares.append({'date': datetime.today().date(), 'shares': num_shares[-1]['shares']})

        sql_insert_query_2 = """SELECT record_dt, close_price FROM historic_data
                                   WHERE sec_id = %s"""
        cursor.execute(sql_insert_query_2, (sec_id,))
        data = cursor.fetchall()
        price_dict = {}
        for i in data:
            price_dict[i[0]] = i[1]
        for i in range(0, len(portfolio_value)):
            if portfolio_value[i]['date'] in price_dict.keys():
                price = price_dict[portfolio_value[i]['date']]
                portfolio_value[i]['price'] += get_adjusted_price(price, portfolio_value[i]['date'], num_shares)

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return portfolio_value


def remove_anomolies(portfolio_data):
    invalid_indexes = []
    for i in range(0, len(portfolio_data)):
        if not portfolio_data[i]['price']:
            invalid_indexes.append(portfolio_data[i])
    for i in invalid_indexes:
        portfolio_data.remove(i)
    return portfolio_data
