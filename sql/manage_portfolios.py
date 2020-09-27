from mysql.connector import Error
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
            if i[2] == sec_id and i[3] >= sell_dt and bool(i[6]):
                bought_shares = bought_shares + i[5]
            elif i[2] == sec_id and i[3] >= sell_dt and not bool(i[6]):
                sold_shares = sold_shares + i[5]
        print(bought_shares)
        print(sold_shares)
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