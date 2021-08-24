import about from './aboutReducer';
import personalInv from './personalInvReducer';
import research from './research';
import sp500 from './s_and_p';
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  about: about,
  personalInv: personalInv,
  research: research,
  sp500: sp500,
});

export default rootReducer