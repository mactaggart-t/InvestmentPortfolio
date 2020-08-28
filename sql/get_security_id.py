import mysql.connector
from mysql.connector import Error


def get_security_id(ticker):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             port=3306,
                                             user='invest_port',
                                             database='investment_portfolio',
                                             password='InvestPortPass')

        cursor = connection.cursor(prepared=True)
        sql_insert_query = """SELECT sec_id FROM all_securities
                           WHERE ticker = %s"""

        cursor.execute(sql_insert_query, (ticker,))
        sec_id = cursor.fetchone()
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
    return sec_id
