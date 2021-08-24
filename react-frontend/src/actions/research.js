import axios from 'axios';

import {
    GET_ALL_TICKERS, API_BASE_URL, NETWORK_ERROR, SUBMIT_SELECTED_TICKERS,
    TWOW, ONEM, THREEM, SIXM, YTD, ONEY, FIVEY, TENY, FORMAT_DATA
} from './types';

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
            dispatch({
                type: NETWORK_ERROR
            })
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
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const formatData = (fullData, time, type) => (dispatch) => {
    let copyData = fullData.slice(0);
    let selected_time = new Date('Jan 1, 2000');
    switch (time) {
        case '2w':
            selected_time = TWOW;
            break;
        case '1m':
            selected_time = ONEM;
            break;
        case '3m':
            selected_time = THREEM;
            break;
        case '6m':
            selected_time = SIXM;
            break;
        case 'ytd':
            selected_time = YTD;
            break;
        case '1y':
            selected_time = ONEY;
            break;
        case '5y':
            selected_time = FIVEY;
            break;
        case '10y':
            selected_time = TENY;
            break;
        default:
            selected_time =  new Date('Jan 1, 2000');
    }
    copyData.reverse();
    const index = copyData.findIndex(element => +new Date(element.date) <= +selected_time);
    let formattedData = copyData.slice(0, index).reverse();
    let reformattedData = [];
    if (type === '%') {
        const basePrices = formattedData[0];
        for (let i = 0; i < formattedData.length; i++) {
            let dataObject = {};
            for (const [key, value] of Object.entries(formattedData[i])) {
                if (key === 'date') {
                    dataObject[key] = value;
                }
                else {
                    dataObject[key] = (value - basePrices[key])/basePrices[key] * 100
                }
            }
            reformattedData.push(dataObject)
        }
        formattedData = reformattedData;
    }
    dispatch({
        type: FORMAT_DATA,
        payload: {formattedData: formattedData, time: time, type: type},
    });
};
