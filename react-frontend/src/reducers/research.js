import {GET_ALL_TICKERS, GET_ERRORS, NETWORK_ERROR} from "../actions/types";

const initialState = {
  items: ['abc', 'aaa'],
  selected: []
};

function research(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TICKERS:
      return { ...state, items: action.payload };
    case NETWORK_ERROR:
      return { ...state, items: ['Network Error']};
    case GET_ERRORS:
      return { ...state, items: ['No items found'] };
    default:
      return state
  }
}

export default research;