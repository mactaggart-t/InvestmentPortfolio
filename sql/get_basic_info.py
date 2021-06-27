from mysql.connector import Error
from .get_security_id import get_price_today, sector_conversion
from .update_data import get_security_id
import pymysql


def get_all_sectors():
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT DISTINCT sector FROM all_securities"""

        cursor.execute(sql_insert_query)
        all_sectors = cursor.fetchall()
        formatted_data = []
        for i in all_sectors:
            converted = sector_conversion(i[0])
            if {"sector": converted, "value": 0} not in formatted_data:
                formatted_data.append({
                    "sector": converted,
                    "value": 0,
                })
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return formatted_data
    except Error as error:
        print("parameterized query failed {}".format(error))


def get_ticker_info(ticker):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sec_id = get_security_id(ticker)
        sql_insert_query = """SELECT * FROM all_securities
                                   WHERE sec_id = %s"""

        cursor.execute(sql_insert_query, (sec_id,))
        all_info = cursor.fetchall()
        formatted_data = [{
            "Company": all_info[0][1],
            "Ticker": ticker,
            "Sector": all_info[0][2],
            "Industry": all_info[0][3],
            "CurrentPrice": get_price_today(sec_id),
        }]
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return formatted_data
    except Error as error:
        print("parameterized query failed {}".format(error))