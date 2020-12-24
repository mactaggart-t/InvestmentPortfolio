from mysql.connector import Error
import pymysql


def sector_conversion(argument):
    switcher = {
        'Communication Services': 'Communication Services',
        'Communication Services\n': 'Communication Services',
        'Consumer Cyclical': 'Consumer Cyclical',
        'Consumer Defensive': 'Consumer Defensive',
        'Consumer Discretionary': 'Consumer Defensive',
        'Consumer Staples': 'Consumer Cyclical',
        'Energy': 'Energy',
        'Financial Services': 'Financials',
        'Financials': 'Financials',
        'Health Care': 'Healthcare',
        'Healthcare': 'Healthcare',
        'Industrials': 'Industrials',
        'Information Technology': 'Information Technology',
        'Materials': 'Materials',
        'Real Estate': 'Real Estate',
        'Technology': 'Information Technology',
        'Utilities': 'Utilities'
    }
    return switcher.get(argument, "Other")


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

