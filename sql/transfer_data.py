import mysql.connector
from mysql.connector import Error
import csv
import pandas as pd


def transfer_data():
    try:
        """connection_local = mysql.connector.connect(host='localhost',
                                             port=3306,
                                             database='investment_portfolio',
                                             user='invest_port',
                                             password='InvestPortPass')"""

        connection_hosted = mysql.connector.connect(host='z8dl7f9kwf2g82re.cbetxkdyhwsb.us-east-1.rds.amazonaws.com	',
                                             port=3306,
                                             database='qbji9vstej2d5zpg',
                                             user='w3k1r20op6d90r3x',
                                             password='figux2h2dqpp5u27')

        #cursor = connection_local.cursor(prepared=True)
        sql_insert_query = """SELECT * FROM all_securities"""
        #cursor.execute(sql_insert_query)
        #rows = cursor.fetchall()
        data = pd.read_csv('temp.csv')
        print(data)
        formated_data = []
        for i in data.iterrows():
            formated_data.append((i[1]['sec_id'], i[1]['sec_name'], i[1]['sector'], i[1]['industry'], i[1]['ticker']))

        cursor2 = connection_hosted.cursor(prepared=True)
        sql_insert_query_2 = """INSERT INTO all_securities (sec_id, sec_name, sector, industry, ticker)
        VALUE (%s,%s,%s,%s,%s)"""
        print(formated_data)
        cursor2.executemany(sql_insert_query_2, formated_data)

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
            cursor2.close()
            connection_local.close()
            connection_hosted.close()
            print("MySQL connection is closed")