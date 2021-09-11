let today = new Date();

function deltaDate(input, days, months, years) {
    return new Date(
      input.getFullYear() + years,
      input.getMonth() + months,
      Math.min(
        input.getDate() + days,
        new Date(input.getFullYear() + years, input.getMonth() + months + 1, 0).getDate()
      )
    );
}

export const GET_ALL_TICKERS = 'GET_ALL_TICKERS';
export const SUBMIT_SELECTED_TICKERS = 'SUBMIT_SELECTED_TICKERS';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const FORMAT_DATA = 'FORMAT_DATA';
export const GET_ALL_SP_CHARTS = 'GET_SP500_CHARTS';
export const SET_SECTOR = 'SET_SECTOR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const CREATE_SUCCESS = 'CREATE_SUCCESS';
export const CREATE_FAILURE = 'CREATE_FAILURE';
export const LOGOUT = 'LOGOUT';
export const PERSONAL_INV_VIEW = 'PERSONAL_INV_VIEW';
export const PORTFOLIO_LOADED = 'PORTFOLIO_LOADED';
export const PURCHASES_LOADED = 'PURCHASES_LOADED';
export const PORT_DATAGRID_LOADED = 'PORT_DATAGRID_LOADED';
export const TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS';
export const TRANSACTION_SAMPLE = 'TRANSACTION_SAMPLE';
export const TRANSACTION_EXIST = 'TRANSACTION_EXIST';
export const TRANSACTION_BAD_SELL = 'TRANSACTION_BAD_SELL';
export const TRANSACTION_SUBMISSION = 'TRANSACTION_SUBMISSION';
export const TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETE';
export const API_BASE_URL = 'http://localhost:5000';
export const TWOW = deltaDate(today, -14, 0, 0);
export const ONEM = deltaDate(today, 0, -1, 0);
export const THREEM = deltaDate(today, 0, -3, 0);
export const SIXM = deltaDate(today, 0, -6, 0);
export const YTD = new Date(today.getFullYear(), 0, 1);
export const ONEY = deltaDate(today, 0, 0, -1);
export const FIVEY = deltaDate(today, 0, 0, -5);
export const TENY = deltaDate(today, 0, 0, -10);
