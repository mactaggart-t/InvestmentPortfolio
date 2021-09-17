from mysql.connector import Error
from loguru import logger
from .get_security_id import get_tickers_from_ids
import pymysql


def get_market_cap_data():
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
        formatted_data = {'all': []}
        for i in range(0, len(data)):
            if sector_list[i] in formatted_data.keys():
                formatted_data[sector_list[i]].append({
                    'name': ticker_list[i],
                    'fullName': security_list[i],
                    'size': data[i][1]
                })
            else:
                formatted_data[sector_list[i]] = [{
                    'name': ticker_list[i],
                    'fullName': security_list[i],
                    'size': data[i][1]
                }]
            formatted_data['all'].append({
                'name': ticker_list[i],
                'fullName': security_list[i],
                'size': data[i][1]
            })
        for key in formatted_data:
            formatted_data[key] = sorted(formatted_data[key], key=lambda k: k['size'])
            formatted_data[key].reverse()
        unique_sectors = set(sector_list)
        unique_sectors = list(unique_sectors)
        unique_sectors.append('all')
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return formatted_data, unique_sectors
    except Error as error:
        print("parameterized query failed {}".format(error))

