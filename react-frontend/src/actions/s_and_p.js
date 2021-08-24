import axios from "axios";
import {API_BASE_URL, GET_ALL_SP_CHARTS, NETWORK_ERROR, SET_SECTOR} from "./types";

const instance = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json'
});

// GET all tickers currently stored in the database
export const getTreemapData = () => (dispatch) => {
    instance
        .get('/api/getTreemapData')
        .then((res) => {
            dispatch({
                type: GET_ALL_SP_CHARTS,
                payload: res.data,
            });
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: NETWORK_ERROR
            })
        });
};

export const setSector = (selectedSector) => (dispatch) => {
    dispatch({
        type: SET_SECTOR,
        payload: selectedSector,
    });
};
