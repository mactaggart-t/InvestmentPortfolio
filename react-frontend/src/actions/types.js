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
export const GET_ERRORS = 'GET_ERRORS';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const FORMAT_DATA = 'FORMAT_DATA';
export const API_BASE_URL = 'http://localhost:5000';
export const TWOW = deltaDate(today, -14, 0, 0);
export const ONEM = deltaDate(today, 0, -1, 0);
export const THREEM = deltaDate(today, 0, -3, 0);
export const SIXM = deltaDate(today, 0, -6, 0);
export const YTD = new Date(today.getFullYear(), 0, 1);
export const ONEY = deltaDate(today, 0, 0, -1);
export const FIVEY = deltaDate(today, 0, 0, -5);
export const TENY = deltaDate(today, 0, 0, -10);
