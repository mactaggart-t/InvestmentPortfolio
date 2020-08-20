from flask import Flask, render_template, json, request

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/personalInv')
def personal_inv():
    return render_template('personalInv.html')


@app.route('/getTickerInfo')
def get_price():
    ticker_name = request.form['ticker_name']
    print(ticker_name)


if __name__ == '__main__':
    app.run()
