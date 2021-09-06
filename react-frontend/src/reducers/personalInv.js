import {LOGIN_SUCCESS, LOGIN_FAILURE, CREATE_SUCCESS, CREATE_FAILURE, LOGOUT} from '../actions/types'

const initialState = {
    isLoggedIn: false,
    loginFailed: true,
    duplicateAccount: true,
    username: '',
};

function personalInv(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, isLoggedIn: true, loginFailed: false, username: action.payload};
        case LOGIN_FAILURE:
            return { ...state, isLoggedIn: false, loginFailed: true};
        case CREATE_SUCCESS:
            return { ...state, isLoggedIn: true, loginFailed: false, duplicateAccount: false, username: action.payload};
        case CREATE_FAILURE:
            return { ...state, isLoggedIn: false, loginFailed: true, duplicateAccount: true};
        case LOGOUT:
            return { ...state, isLoggedIn: false, loginFailed: true, username: ''};
        default:
            return state;
    }
}

export default personalInv;