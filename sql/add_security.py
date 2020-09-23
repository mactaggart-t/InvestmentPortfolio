from mysql.connector import Error
import pymysql


def add_security(ticker, sec_name, sec_sector, sec_industry):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """INSERT INTO all_securities
                           (sec_name, sector, industry, ticker) VALUES (%s, %s, %s, %s)"""

        cursor.executemany(sql_insert_query, [(sec_name, sec_sector, sec_industry, ticker)])
        connection_hosted.commit()
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")