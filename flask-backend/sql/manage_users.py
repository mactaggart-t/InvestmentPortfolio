from mysql.connector import Error
import pymysql
from werkzeug.security import check_password_hash


def user_taken(username):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT * FROM users_list WHERE username = %s"""

        cursor.executemany(sql_insert_query, (username,))
        try:
            exists = cursor.fetchone()[0]
            exists = True
        except TypeError:
            exists = False

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return exists


def add_user(username, password):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')

        cursor = connection_hosted.cursor()
        sql_insert_query = """INSERT INTO users_list
                           (username, pass) VALUES (%s, %s)"""

        cursor.executemany(sql_insert_query, [(username, password)])
        connection_hosted.commit()
    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")


def get_user_id(username):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT user_id FROM users_list WHERE username = %s"""

        cursor.executemany(sql_insert_query, (username,))
        user_id = cursor.fetchone()[0]

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return user_id


def good_login(username, password):
    try:
        connection_hosted = pymysql.connect(host='investmentport.c1xr79lgjc2q.us-east-1.rds.amazonaws.com',
                                            db='investment_portfolio',
                                            user='investPort',
                                            passwd='InvestPortPass')
        cursor = connection_hosted.cursor()
        sql_insert_query = """SELECT * FROM users_list WHERE username = %s"""

        cursor.executemany(sql_insert_query, (username,))
        try:
            exists = cursor.fetchone()[2]
            if check_password_hash(exists, password):
                exists = True
            else:
                exists = False
        except TypeError:
            exists = False

    except Error as error:
        print("parameterized query failed {}".format(error))
    finally:
        cursor.close()
        connection_hosted.close()
        print("MySQL connection is closed")
        return exists