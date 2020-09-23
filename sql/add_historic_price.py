from mysql.connector import Error
import pymysql


def add_historic_price(sec_id, prices, dates):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        records_to_insert = []
        for i in range(0, len(prices)):
            records_to_insert.append((sec_id, dates[i], prices[i]))
        sql_insert_query = """INSERT INTO historic_data
                           (sec_id, record_dt, close_price) VALUES (%s,%s,%s)"""

        cursor.executemany(sql_insert_query, records_to_insert)
        connection_hosted.commit()
        print("Data inserted successfully table")

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
