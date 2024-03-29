import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    API_BASE_URL,
    NETWORK_ERROR,
    CREATE_SUCCESS,
    CREATE_FAILURE,
    PERSONAL_INV_VIEW,
    PORTFOLIO_LOADED,
    PURCHASES_LOADED,
    PORT_DATAGRID_LOADED,
    TRANSACTION_SUCCESS,
    TRANSACTION_BAD_SELL,
    TRANSACTION_EXIST,
    TRANSACTION_SAMPLE,
    TRANSACTION_SUBMISSION,
    TRANSACTION_COMPLETE,
    TRANSACTION_HIST_LOADED,
    IND_SUBMIT_TICKERS, PORT_TICKERS_RETRIEVED, RESET_LOAD, SEC_DIV_RETRIEVED, SECTOR_DIV_RETRIEVED
} from "./types";
import axios from "axios";

const instance = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json'
});

export const loginFunc = (username, password) => (dispatch) => {
    instance
        .post('/signIn', {username: username, password: password})
        .then((res) => {
            if (res.data.result === 'success') {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data.username,
                });
            }
            else {
                dispatch({
                    type: LOGIN_FAILURE,
                });
            }
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const createAcct = (username, password1, password2) => (dispatch) => {
    instance
        .post('/createAcct', {username: username, password1: password1, password2: password2})
        .then((res) => {
            if (res.data.response === 'success') {
                dispatch({
                    type: CREATE_SUCCESS,
                    payload: res.data.username,
                });
            }
            else {
                dispatch({
                    type: CREATE_FAILURE,
                });
            }
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT,
    });
};

export const changeView = (state) => dispatch => {
    dispatch({
        type: PERSONAL_INV_VIEW,
        payload: state[0].value,
    });
};

export const getPortValue = (username) => (dispatch) => {
    instance
        .post('/loadPortfolio', {username: username})
        .then((res) => {
            dispatch({
                type: PORTFOLIO_LOADED,
                payload: res.data.port_value,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const getPurchases = (username) => (dispatch) => {
    instance
        .post('/getTotalPurchase', {username: username})
        .then((res) => {
            dispatch({
                type: PURCHASES_LOADED,
                payload: res.data.purchase,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const getPortfolio = (username) => (dispatch) => {
    instance
        .post('/loadPortfolioDataGrid', {username: username})
        .then((res) => {
            dispatch({
                type: PORT_DATAGRID_LOADED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const addTransaction = (username, ticker, buyOrSell, price, shares, date) => (dispatch) => {
    instance
        .post('/newTransaction', {username: username, ticker: ticker, buy_sell: buyOrSell,
            price: price, shares: shares, dt: date})
        .then((res) => {
            switch (res.data) {
                case 'no sample':
                    dispatch({
                        type: TRANSACTION_SAMPLE,
                    });
                    break;
                case 'no exist':
                    dispatch({
                        type: TRANSACTION_EXIST,
                    });
                    break;
                case 'invalid sell':
                    dispatch({
                        type: TRANSACTION_BAD_SELL
                    });
                    break;
                default:
                    dispatch({
                        type: TRANSACTION_SUCCESS,
                    });
            }
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const transactionSubmission = (typeSubmit) => (dispatch) => {
    if (typeSubmit === 'starting') {
        dispatch({
            type: TRANSACTION_SUBMISSION,
        });
    } else {
        dispatch({
            type: TRANSACTION_COMPLETE,
        });
    }
};

export const getTransactHist = (username) => (dispatch) => {
    instance
        .post('/loadTransactionHistory', {username: username})
        .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i]['PurchaseOrSaleDate'] = new Date(res.data[i]['PurchaseOrSaleDate']);
            }
            dispatch({
                type: TRANSACTION_HIST_LOADED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const submitSelectedTickers = (selectedTickers) => (dispatch) => {
    instance
        .post('/getTickerValues', {'selected': selectedTickers})
        .then((res) => {
            dispatch({
                type: IND_SUBMIT_TICKERS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const getPortfolioTickers = (username) => (dispatch) => {
    instance
        .post('/getPortTickers', {'username': username})
        .then((res) => {
            dispatch({
                type: PORT_TICKERS_RETRIEVED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const resetLoaded = () => (dispatch) => {
  dispatch({
      type: RESET_LOAD,
  })
};

export const loadPortDiversity = (username) => (dispatch) => {
    instance
        .post('/loadSecDistribution', {'username': username})
        .then((res) => {
            dispatch({
                type: SEC_DIV_RETRIEVED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
    instance
        .post('/loadSectorDistribution', {'username': username})
        .then((res) => {
            dispatch({
                type: SECTOR_DIV_RETRIEVED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};