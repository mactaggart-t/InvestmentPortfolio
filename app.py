from datetime import datetime

from flask import Flask, render_template, jsonify, request

from getTickerInformation import get_security_price, get_historic_data, get_sector, get_industry, get_name
from sql.add_historic_price import add_historic_price
from sql.add_security import add_security
from sql.get_security_id import get_security_id
from sql.get_historic_price import get_historic_price_db
from sql.load_s_and_p_data import get_all_s_and_p

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
        add_security(get_name(ticker_name), ticker_name, get_sector(ticker_name), get_industry(ticker_name))
        sec_id = get_security_id(ticker_name)
        dates, prices = get_historic_data(ticker_name, datetime.today().timestamp(),
                                          datetime(2018, 1, 1, 0, 0).timestamp())
        add_historic_price(sec_id[0], prices, dates)
    data = get_historic_price_db(sec_id)
    return jsonify(data)


@app.route('/getSecurityChart')
def get_chart():
    ticker_name = request.args['ticker_name']
    start_dt = request.args['start_dt']
    end_dt = request.args['end_dt']
    return get_historic_data(ticker_name, datetime(2016, 1, 19, 0, 0).timestamp(), datetime.today().timestamp())


@app.route('/research')
def research_home():
    return render_template('research.html')


@app.route('/s_and_p')
def render_s_and_p():
    return render_template('s_and_p.html')


@app.route('/loadSAndP')
def load_s_and_p():
    tickers, names, sector, industry = get_all_s_and_p()
    for i in tickers:
        print(i)
        sec_id = get_security_id(i)
        dates, prices = get_historic_data(i, datetime.today().timestamp(),
                                          datetime(2018, 1, 1, 0, 0).timestamp())
        add_historic_price(sec_id[0], prices, dates)

    return 'Success'


if __name__ == '__main__':
    app.run(debug=True)
