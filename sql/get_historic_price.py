import mysql.connector
from mysql.connector import Error


def get_historic_price_db(sec_id):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             port=3306,
                                             database='investment_portfolio',
                                             user='invest_port',
                                             password='InvestPortPass')

        cursor = connection.cursor(prepared=True)
        sql_insert_query = """SELECT record_dt, close_price FROM historic_data
                                   WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, sec_id)
        data = cursor.fetchall()
        formated_data = []
        for i in data:
            formated_data.append({'date': i[0], 'price': i[1]})
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
    return formated_data