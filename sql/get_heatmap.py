from mysql.connector import Error
from .get_security_id import get_tickers_from_ids
import pymysql


def get_heatmap():
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT sec_id, market_cap FROM today_data
                              WHERE in_s_p = 1"""
        cursor.execute(sql_insert_query)
        data = cursor.fetchall()
        sec_id_list = []
        for i in data:
            sec_id_list.append(i[0])
        ticker_list, sector_list, security_list = get_tickers_from_ids(sec_id_list)
        formatted_data = []
        for i in range(0, len(data)):
            if not any(d['name'] == sector_list[i] for d in formatted_data):
                formatted_data.append({
                    'name': sector_list[i],
                    'items': [{
                        'value': data[i][1],
                        'name': ticker_list[i],
                        'sec_name': security_list[i]
                    }]
                })
            else:
                for j in formatted_data:
                    if j['name'] == sector_list[i]:
                        j['items'].append({
                            'value': data[i][1],
                            'name': ticker_list[i],
                            'sec_name': security_list[i]
                        })
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return formatted_data
    except Error as error:
        print("parameterized query failed {}".format(error))

