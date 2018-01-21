import {
  SET_MEDIA,
} from './../actions';

export default (state = {
  initialRequestSend: false,
  mediaArray: [],
}, action) => {
  const { type } = action;
  const sState = Object.assign({}, state);
  switch (type) {
    case (SET_MEDIA):
      sState.initialRequestSend = true;
      sState.mediaArray = action.mediaArray;
      break;
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unhandled action: ${type}`);
      }
  }
  return sState;
};
