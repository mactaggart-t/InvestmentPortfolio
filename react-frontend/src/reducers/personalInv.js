import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    CREATE_SUCCESS,
    CREATE_FAILURE,
    LOGOUT,
    PERSONAL_INV_VIEW,
    PORTFOLIO_LOADED, FORMAT_DATA
} from '../actions/types'

const initialState = {
    isLoggedIn: false,
    loginFailed: true,
    duplicateAccount: true,
    username: '',
    selectedView: 'Portfolio Balance',
    chartData: [],
    formattedData: [],
    type: '$',
    time: 'all'
};

function personalInv(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state,
                isLoggedIn: true,
                loginFailed: false,
                username: action.payload};
        case LOGIN_FAILURE:
            return { ...state,
                isLoggedIn: false,
                loginFailed: true};
        case CREATE_SUCCESS:
            return { ...state,
                isLoggedIn: true,
                loginFailed: false,
                duplicateAccount: false,
                username: action.payload};
        case CREATE_FAILURE:
            return { ...state,
                isLoggedIn: false,
                loginFailed: true,
                duplicateAccount: true};
        case LOGOUT:
            return { ...state,
                isLoggedIn: false,
                loginFailed: true,
                username: ''};
        case PERSONAL_INV_VIEW:
            return { ...state,
                selectedView: action.payload};
        case PORTFOLIO_LOADED:
            return { ...state,
                chartData: action.payload,
                formattedData: action.payload};
        case FORMAT_DATA:
            return {...state,
                formattedData: action.payload.formattedData,
                time: action.payload.time,
                type: action.payload.type};
        default:
            return state;
    }
}

export default personalInv;