import axios from 'axios';

import {
    GET_ALL_TICKERS, API_BASE_URL, NETWORK_ERROR, SUBMIT_SELECTED_TICKERS,
} from './types';

const instance = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json'
});

// GET all tickers currently stored in the database
export const getAllTickers = () => (dispatch) => {
    instance
        .get('/getAllTickers')
        .then((res) => {
            dispatch({
                type: GET_ALL_TICKERS,
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
                type: SUBMIT_SELECTED_TICKERS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: NETWORK_ERROR
            })
        });
};
