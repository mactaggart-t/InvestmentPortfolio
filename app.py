from datetime import datetime

from flask import Flask, render_template, jsonify, request, session
from werkzeug.security import generate_password_hash

from getTickerInformation import (get_historic_data, get_sector, get_industry, get_name,
                                  ticker_exists)
from sql.add_historic_price import add_historic_price
from sql.add_security import add_security
from sql.get_security_id import get_security_id, get_all_tickers
from sql.get_historic_price import get_historic_price_db
from sql.manage_users import user_taken, add_user, get_user_id, good_login
from sql.manage_portfolios import check_valid_sell, add_purchase

app = Flask(__name__)
app.secret_key = 'test'


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/personalInv')
def personal_inv():
    return render_template('personalInv.html')


@app.route('/research')
def research_home():
    return render_template('research.html')


@app.route('/s_and_p')
def render_s_and_p():
    return render_template('s_and_p.html')


@app.route('/getAllTickers')
def get_all_tick():
    return jsonify(get_all_tickers())


@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')


@app.route('/createAccount')
def create_account():
    return render_template('create_portfolio.html')


@app.route('/createAcct')
def create_acct():
    username = request.args['username']
    password1 = request.args['password']
    password2 = request.args['secondPass']
    if password1 != password2:
        return 'no match'
    elif password1 == '':
        return 'no empty'
    elif user_taken(username):
        return 'username taken'
    add_user(username, generate_password_hash(password1))
    session['username'] = username
    session['user_id'] = get_user_id(username)
    return 'success'


@app.route('/signIn')
def log_in():
    username = request.args['username']
    password = request.args['password']
    if good_login(username, password):
        session['username'] = username
        session['user_id'] = get_user_id(username)
        return 'success'
    return 'failure'


@app.route('/getUsername')
def get_username():
    return session.get('username')


@app.route('/newTransaction')
def new_transaction():
    user = get_user_id(session.get('username'))
    ticker = request.args['ticker']
    buy = request.args['buy_sell'] == "Buy"
    price = request.args['price']
    shares = int(request.args['shares'])
    dt = request.args['dt']
    dt = datetime.strptime(dt, '%a %b %d %Y %H:%M:%S GMT-0500 (Eastern Standard Time)').date()
    sec_id = get_security_id(ticker)
    if sec_id is None:
        if ticker_exists(ticker):
            add_security(ticker, get_name(ticker), get_sector(ticker),
                         get_industry(ticker))
            sec_id = get_security_id(ticker)
            dates, prices = get_historic_data(ticker, datetime.today().timestamp(),
                                              datetime(2000, 1, 1, 0, 0).timestamp())
            add_historic_price(sec_id, prices, dates)
        else:
            return 'no exist'
    if not buy:
        if check_valid_sell(shares, sec_id, user, dt):
            add_purchase(sec_id, user, dt, price, buy, shares)
            return 'valid sell'
        else:
            return 'invalid sell'
    add_purchase(sec_id, user, dt, price, buy, shares)
    return 'success'


@app.route('/getTickerInfo')
def get_price():
    ticker_name = request.args['tickers'].replace('[', '').replace(']', '').replace('"', '').split(',')
    sec_id = []
    names = []
    data = []
    for i in ticker_name:
        sec_id.append(get_security_id(i))
        names.append(get_name(i))
    for i in range(0, len(sec_id)):
        if sec_id[i] is None:
            if ticker_exists(ticker_name[i]):
                add_security(ticker_name[i], get_name(ticker_name[i]), get_sector(ticker_name[i]),
                             get_industry(ticker_name[i]))
                sec_id[i] = get_security_id(ticker_name)
                dates, prices = get_historic_data(ticker_name, datetime.today().timestamp(),
                                                  datetime(2000, 1, 1, 0, 0).timestamp())
                add_historic_price(sec_id[i], prices, dates)
            else:
                return 'DNE'
        data.append(get_historic_price_db(sec_id[i]))
    all_data = jsonify([names, ticker_name, data])
    return all_data


@app.route('/getSecurityChart')
def get_chart():
    ticker_name = request.args['ticker_name']
    start_dt = request.args['start_dt']
    end_dt = request.args['end_dt']
    return get_historic_data(ticker_name, datetime(2016, 1, 19, 0, 0).timestamp(), datetime.today().timestamp())


@app.route('/loadSAndP')
def load_s_and_p():
    # transfer_data()
    """unfilled_tickers = get_unfilled_tickers()
    for i in unfilled_tickers:
        sec_id = get_security_id(i)
        if not_in_db(sec_id):
            print(i)
            dates, prices = get_historic_data(i.replace('.', '-'), datetime.today().timestamp(),
                                              datetime(2000, 1, 1, 0, 0).timestamp())
            add_historic_price(sec_id, prices, dates)"""

    return 'Success'


if __name__ == '__main__':
    app.run(debug=True)
