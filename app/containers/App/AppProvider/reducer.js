import { fromJS } from 'immutable';
import { LOADING } from './constants';

export const initialState = fromJS({
  loading: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return state.set('loading', action.loading);
    default:
      return state;
  }
}

export default appReducer;
