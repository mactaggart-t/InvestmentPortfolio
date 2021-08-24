from datetime import datetime, date, timedelta

from flask import Flask, render_template, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash

from getTickerInformation import get_sector, get_industry, get_name, ticker_exists
from sql.add_security import add_security
from sql.get_historic_price import get_historic_price_db
from sql.manage_users import user_taken, add_user, get_user_id, good_login
from sql.manage_portfolios import check_valid_sell, add_purchase, get_port_secs, add_value, remove_anomolies
from sql.update_data import get_historic_data, add_historic_price, get_security_id, get_all_tickers
from sql.get_security_id import (get_ticker_from_id, get_name_from_id, get_purchase, get_price_today, get_purchases,
                                 get_sector_from_id)
from sql.transaction_history import get_transaction_history
from sql.get_basic_info import get_all_sectors, sector_conversion, get_ticker_info
from sql.get_treemap_data import get_market_cap_data

app = Flask(__name__, template_folder='./react-frontend', static_folder="./react-frontend")
app.secret_key = 'test'
CORS(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/getAllTickers', methods=['GET'])
def get_all_tick():
    return jsonify(get_all_tickers())


@app.route('/api/getTickerValues', methods=['POST'])
def get_ticker_values():
    tickers = request.json['selected']
    data = []
    chart_data = []
    for i in tickers:
        data.append(get_historic_price_db(get_security_id(i)))
    for ticker_data in data:
        for datapoint in ticker_data:
            found_item = next((item for item in chart_data if item['date'] == datapoint['date']), None)
            if found_item is None:
                chart_data.append({'date': datapoint['date'], datapoint['ticker']: datapoint['price']})
            else:
                found_item[datapoint['ticker']] = datapoint['price']
    chart_data = sorted(chart_data, key=lambda k: k['date'])
    return jsonify({'chartData': chart_data, 'selected': tickers})


@app.route('/api/getTreemapData', methods=['GET'])
def get_treemap_data():
    market_cap_data, all_sectors = get_market_cap_data()
    return jsonify({'marketCapData': market_cap_data, 'allSectors': all_sectors})


@app.route('/getPortTickers')
def get_port_tick():
    sec_ids = get_port_secs(session.get('user_id'))
    data = []
    for i in sec_ids:
        ticker = get_ticker_from_id(i)
        purchase_price, shares = get_purchase(session.get('user_id'), i)
        if shares <= 0:
            continue
        data.append(ticker)
    return jsonify(data)


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
    if session.get('username') == 'Sample':
        return 'no sample'
    user = session.get('user_id')
    ticker = request.args['ticker']
    buy = request.args['buy_sell'] == "Buy"
    price = request.args['price']
    shares = int(request.args['shares'])
    dt = request.args['dt']
    dt = datetime.strptime(dt[0:15], '%a %b %d %Y').date()
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


@app.route('/loadPortfolio')
def load_portfolio():
    sec_ids = get_port_secs(session.get('user_id'))
    portfolio_value = []
    names = ["Portfolio Value"]
    ticker = ["PORT"]
    start_date = datetime.today().date()
    end_date = date(2000, 1, 1)
    delta = timedelta(days=1)
    while start_date-delta >= end_date:
        if start_date.weekday() != 5 and start_date.weekday() != 6:
            portfolio_value.append({'date': start_date, 'price': 0})
        start_date -= delta
    for i in sec_ids:
        portfolio_value = add_value(i, session.get('user_id'), end_date, portfolio_value)
    portfolio_value = remove_anomolies(portfolio_value)
    all_data = jsonify([names, ticker, [portfolio_value]])
    return all_data


@app.route('/loadPortfolioDataGrid')
def get_portfolio():
    sec_ids = get_port_secs(session.get('user_id'))
    data = []
    for i in sec_ids:
        name = get_name_from_id(i)
        ticker = get_ticker_from_id(i)
        purchase_price, shares = get_purchase(session.get('user_id'), i)
        current_price = get_price_today(i)
        if shares <= 0:
            continue
        data.append(
            {"Company": name,
             "Ticker": ticker,
             "PurchasePrice": purchase_price,
             "Shares": shares,
             "CurrentPrice": current_price,
             "MarketValue": current_price*shares,
             "Gain$": (current_price-purchase_price)*shares,
             "Gain%": (current_price-purchase_price)*shares/(purchase_price*shares)
             }
        )
    return jsonify(data)


@app.route('/loadTransactionHistory')
def load_transaction_history():
    user_id = (session.get('user_id'))
    data = get_transaction_history(user_id)
    return jsonify(data)


@app.route('/loadSecDistribution')
def load_sec_distribution():
    sec_ids = get_port_secs(session.get('user_id'))
    data = []
    total_price = 0
    for i in sec_ids:
        ticker = get_ticker_from_id(i)
        purchase_price, shares = get_purchase(session.get('user_id'), i)
        current_price = get_price_today(i)
        if shares <= 0:
            continue
        data.append({
            'ticker': ticker,
            'value': current_price * shares
        })
        total_price = total_price + (current_price * shares)
    data = sorted(data, key=lambda item: item["value"])
    return jsonify([data, total_price])


@app.route('/loadSectorDistribution')
def load_sector_distribution():
    sectors = get_all_sectors()
    sec_ids = get_port_secs(session.get('user_id'))
    for i in sec_ids:
        sector = get_sector_from_id(i)
        purchase_price, shares = get_purchase(session.get('user_id'), i)
        current_price = get_price_today(i)
        if shares <= 0:
            continue
        for j in sectors:
            if j["sector"] == sector_conversion(sector):
                j["value"] = j["value"] + current_price * shares
    sectors = sorted(sectors, key=lambda item: item["value"])
    return jsonify(sectors)


@app.route('/getTotalPurchase')
def get_total_purchase():
    user_id = (session.get('user_id'))
    daily_purchase = get_purchases(user_id)
    return jsonify({'purchase': daily_purchase})


@app.route('/getTickerInfo')
def get_price():
    ticker_name = request.args['tickers'].replace('[', '').replace(']', '').replace('"', '').split(',')
    sec_id = []
    names = []
    data = []

    for i in ticker_name:
        sec_id.append(get_security_id(i))
        names.append(get_name_from_id(sec_id[-1]))
    for i in range(0, len(sec_id)):
        if sec_id[i] is None:
            if ticker_exists(ticker_name[i]):
                add_security(ticker_name[i], get_name(ticker_name[i]), get_sector(ticker_name[i]),
                             get_industry(ticker_name[i]))
                sec_id[i] = get_security_id(ticker_name[i])
                dates, prices = get_historic_data(ticker_name[i], datetime.today().timestamp(),
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
    return get_historic_data(ticker_name, datetime(2016, 1, 19, 0, 0).timestamp(), datetime.today().timestamp())


@app.route('/getSingleTickerInfo')
def get_single_ticker_info():
    ticker = request.args['ticker'].replace('[', '').replace(']', '').replace('"', '').split(',')[0]
    return jsonify(get_ticker_info(ticker))


@app.route('/getHeatmap')
def get_heatmap_endpoint():
    return jsonify(get_heatmap())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
