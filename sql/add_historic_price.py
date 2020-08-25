import mysql.connector
from mysql.connector import Error


def add_historic_price(sec_id, prices, dates):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             port=3306,
                                             database='investment_portfolio',
                                             user='invest_port',
                                             password='InvestPortPass')

        cursor = connection.cursor(prepared=True)
        records_to_insert = []
        for i in range(0, len(prices)):
            records_to_insert.append((sec_id, dates[i], prices[i]))
        sql_insert_query = """INSERT INTO historic_data
                           (sec_id, record_dt, close_price) VALUES (%s,%s,%s)"""

        cursor.executemany(sql_insert_query, records_to_insert)
        connection.commit()
        print("Data inserted successfully table")

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
