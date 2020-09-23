import mysql.connector
from mysql.connector import Error
import pymysql


def transfer_data():
    try:
        connection_local = mysql.connector.connect(host='localhost',
                                             port=3306,
                                             database='investment_portfolio',
                                             user='invest_port',
                                             password='InvestPortPass')

        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                             db='investment_portfolio',
                                             user='investPort',
                                             passwd='InvestPortPass')

        cursor = connection_local.cursor(prepared=True)
        sql_insert_query = """SELECT * FROM historic_data"""
        cursor.execute(sql_insert_query)
        data = cursor.fetchall()
        cursor2 = connection_hosted.cursor()
        sql_insert_query_3 = """SET autocommit = 1;"""
        sql_insert_query_2 = """INSERT INTO historic_data (index_id, sec_id, record_dt, close_price)
        VALUE (%s,%s,%s,%s)"""
        cursor2.execute(sql_insert_query_3)
        cursor2.executemany(sql_insert_query_2, data)

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
            cursor.close()
            cursor2.close()
            connection_local.close()
            connection_hosted.close()
            print("MySQL connection is closed")
