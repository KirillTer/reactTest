import { createStore, combineReducers } from 'redux';
import Session from './Reducer/Session';
import Media from './Reducer/Media';

const combinedReducer = combineReducers({ Session, Media });

/*eslint-disable */
const store = createStore(
  combinedReducer,
  (window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV === 'development')
  && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/*eslint-enable */

export default store;
