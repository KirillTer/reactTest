import cookies from 'js-cookie';
import {
  SET_TOKEN,
  LOGOUT,
} from './../actions';

const defaultState = {
  loginStatus: false,
  token: '',
};
if (cookies.get('AUTH_TOKEN')) {
  defaultState.loginStatus = true;
  defaultState.token = cookies.get('AUTH_TOKEN');
}

export default (state = defaultState, action) => {
  const { type } = action;
  const sState = Object.assign({}, state);
  switch (type) {
    case (SET_TOKEN):
      sState.token = action.TOKEN;
      sState.loginStatus = true;
      cookies.set('AUTH_TOKEN', action.TOKEN, { expires: 1 });
      break;
    case (LOGOUT):
      sState.token = '';
      sState.loginStatus = false;
      cookies.remove('AUTH_TOKEN');
      break;
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unhandled action: ${type}`);
      }
  }
  return sState;
};
