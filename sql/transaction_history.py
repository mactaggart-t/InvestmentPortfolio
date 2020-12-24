from mysql.connector import Error
from .get_security_id import get_name_from_id, get_ticker_from_id
import pymysql


def get_transaction_history(user_id):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT * FROM portfolios WHERE user_id = %s"""

        cursor.executemany(sql_insert_query, (user_id,))
        all_transactions = cursor.fetchall()
        formatted_data = []
        for i in all_transactions:
            formatted_data.append({
                "Company": get_name_from_id(i[2]),
                "Ticker": get_ticker_from_id(i[2]),
                "PurchaseOrSale": "Purchase" if i[6] else "Sale",
                "PurchaseOrSalePrice": i[4],
                "Shares": i[5],
                "PurchaseOrSaleDate": i[3]
            })
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return formatted_data
    except Error as error:
        print("parameterized query failed {}".format(error))
