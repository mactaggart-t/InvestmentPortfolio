import {GET_ALL_TICKERS, GET_ERRORS, NETWORK_ERROR, SUBMIT_SELECTED_TICKERS} from "../actions/types";

const initialState = {
  items: [],
  selected: [],
  chartData: []
};

function research(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TICKERS:
      return { ...state, items: action.payload };
    case SUBMIT_SELECTED_TICKERS:
      return { ...state, chartData: action.payload.chartData, selected: action.payload.selected };
    case NETWORK_ERROR:
      return { ...state, items: ['Network Error']};
    case GET_ERRORS:
      return { ...state, items: ['No items found'] };
    default:
      return state
  }
}

export default research;