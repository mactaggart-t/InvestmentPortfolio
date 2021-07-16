import {GET_ALL_TICKERS, GET_ERRORS, NETWORK_ERROR, SUBMIT_SELECTED_TICKERS, FORMAT_DATA} from "../actions/types";

const initialState = {
  items: [],
  selected: [],
  chartData: [],
  formattedData: [],
  time: 'all',
  type: '$'
};

function research(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TICKERS:
      return { ...state, items: action.payload };
    case SUBMIT_SELECTED_TICKERS:
      return { ...state,
        chartData: action.payload.chartData,
        selected: action.payload.selected,
        formattedData: action.payload.chartData,
        time: 'all',
        type: '$'};
    case NETWORK_ERROR:
      return { ...state, items: ['Network Error']};
    case GET_ERRORS:
      return { ...state, items: ['No items found'] };
    case FORMAT_DATA:
      return {...state,
        formattedData: action.payload.formattedData,
        time: action.payload.time,
        type: action.payload.type};
    default:
      return state
  }
}

export default research;