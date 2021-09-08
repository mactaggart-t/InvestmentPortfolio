import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    API_BASE_URL,
    NETWORK_ERROR, CREATE_SUCCESS, CREATE_FAILURE, PERSONAL_INV_VIEW, PORTFOLIO_LOADED, PURCHASES_LOADED,
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