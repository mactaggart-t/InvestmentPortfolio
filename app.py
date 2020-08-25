from datetime import datetime

from flask import Flask, render_template, json, request

from getTickerPrice import get_security_price, get_historic_data
from sql.add_historic_price import add_historic_price
from sql.add_security import add_security
from sql.get_security_id import get_security_id

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/personalInv')
def personal_inv():
    return render_template('personalInv.html')


@app.route('/getTickerInfo')
def get_price():
    ticker_name = request.args['ticker_name']
    sec_id = get_security_id(ticker_name)
    if sec_id is None:
        add_security(ticker_name, 'Tech', 'Tech')
        sec_id = get_security_id(ticker_name)
    print(sec_id[0])
    dates, prices = get_historic_data(ticker_name, datetime.today().timestamp(), datetime(2018, 1, 1, 0, 0).timestamp())
    add_historic_price(sec_id[0], prices, dates)
    return get_security_price(ticker_name)


@app.route('/getSecurityChart')
def get_chart():
    ticker_name = request.args['ticker_name']
    start_dt = request.args['start_dt']
    end_dt = request.args['end_dt']
    return get_historic_data(ticker_name, datetime(2016, 1, 19, 0, 0).timestamp(), datetime.today().timestamp())


if __name__ == '__main__':
    app.run(debug=True)
