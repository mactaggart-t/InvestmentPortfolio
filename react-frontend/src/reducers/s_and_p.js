import {GET_ALL_SP_CHARTS, SET_SECTOR} from "../actions/types";

const initialState = {
    marketCapData: {},
    allSectors: [],
    selectedSector: 'all',
};

function sp500(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SP_CHARTS:
        return { ...state, marketCapData: action.payload.marketCapData, allSectors: action.payload.allSectors };
    case SET_SECTOR:
        return { ...state, selectedSector: action.payload};
    default:
        return state
  }
}

export default sp500;