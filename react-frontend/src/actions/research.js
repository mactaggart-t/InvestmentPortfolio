import axios from 'axios';
import { returnErrors } from './messages';

import { GET_ALL_TICKERS, API_BASE_URL, NETWORK_ERROR, SUBMIT_SELECTED_TICKERS } from './types';

const instance = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json'
});

// GET all tickers currently stored in the database
export const getAllTickers = () => (dispatch) => {
    instance
        .get('/api/getAllTickers')
        .then((res) => {
            dispatch({
                type: GET_ALL_TICKERS,
                payload: res.data,
            });
        })
        .catch((err) => {
            if (typeof err.response === "undefined") {
                dispatch({
                    type: NETWORK_ERROR
                })
            }
            else {
                dispatch(returnErrors('error', err))
            }
        });
};

export const submitSelectedTickers = (selectedTickers) => (dispatch) => {
    instance
        .post('/api/getTickerValues', {'selected': selectedTickers})
        .then((res) => {
            dispatch({
                type: SUBMIT_SELECTED_TICKERS,
                payload: res.data,
            });
        })
        .catch((err) => {
            if (typeof err.response === "undefined") {
                dispatch({
                    type: NETWORK_ERROR
                })
            }
            else {
                dispatch(returnErrors('error', err))
            }
        });
};
