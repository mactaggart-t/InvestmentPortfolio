from mysql.connector import Error
import pymysql


def get_historic_price_db(sec_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT record_dt, close_price FROM historic_data
                                   WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        data = cursor.fetchall()
        formated_data = []
        for i in data:
            formated_data.append({'date': i[0], 'price': i[1]})
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
    return formated_data