import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    CREATE_SUCCESS,
    CREATE_FAILURE,
    LOGOUT,
    PERSONAL_INV_VIEW,
    PORTFOLIO_LOADED,
    FORMAT_DATA,
    PURCHASES_LOADED,
    PORT_DATAGRID_LOADED,
    TRANSACTION_SUCCESS,
    TRANSACTION_BAD_SELL,
    TRANSACTION_EXIST,
    TRANSACTION_SAMPLE,
    TRANSACTION_SUBMISSION,
    TRANSACTION_COMPLETE, TRANSACTION_HIST_LOADED
} from '../actions/types'

const initialState = {
    isLoggedIn: false,
    loginFailed: false,
    duplicateAccount: true,
    username: '',
    selectedView: 'Portfolio Balance',
    chartData: [],
    formattedData: [],
    purchases: [],
    portfolioDatagrid: [],
    type: '$',
    time: 'all',
    transactionResponse: '',
    transactionSubmitting: false,
    transactHist: [],
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
                duplicateAccount: true};
        case LOGOUT:
            return { ...state,
                isLoggedIn: false,
                loginFailed: false,
                duplicateAccount: true,
                username: '',
                selectedView: 'Portfolio Balance',
                chartData: [],
                formattedData: [],
                purchases: [],
                portfolioDatagrid: [],
                type: '$',
                time: 'all',
                transactionResponse: ''
                };
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
        case PURCHASES_LOADED:
            return {...state,
                purchases: action.payload};
        case PORT_DATAGRID_LOADED:
            return {...state,
                portfolioDatagrid: action.payload};
        case TRANSACTION_SUCCESS:
            return {...state,
                transactionResponse: 'success'};
        case TRANSACTION_SAMPLE:
            return {...state,
                transactionResponse: 'no sample'};
        case TRANSACTION_EXIST:
            return {...state,
                transactionResponse: 'no exist'};
        case TRANSACTION_BAD_SELL:
            return {...state,
                transactionResponse: 'bad sell'};
        case TRANSACTION_SUBMISSION:
            return {...state,
                transactionSubmitting: true, transactionResponse: ''};
        case TRANSACTION_COMPLETE:
            return {...state, transactionSubmitting: false};
        case TRANSACTION_HIST_LOADED:
            return {...state, transactHist: action.payload};
        default:
            return state;
    }
}

export default personalInv;