import mysql.connector
from mysql.connector import Error


def add_security(sec_name, sec_sector, sec_industry):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             port=3306,
                                             user='invest_port',
                                             database='investment_portfolio',
                                             password='InvestPortPass')

        cursor = connection.cursor(prepared=True)
        sql_insert_query = """INSERT INTO all_securities
                           (sec_name, sector, industry) VALUES (%s, %s, %s)"""

        cursor.executemany(sql_insert_query, [(sec_name, sec_sector, sec_industry)])
        connection.commit()
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")