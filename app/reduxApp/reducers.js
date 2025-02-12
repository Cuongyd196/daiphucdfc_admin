import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import {getPermissionReducer} from '@containers/Layout/HeaderComponent/HeaderProvider/reducer';
import history from "@utils/history";

import toggleSiderReducer from "@containers/Layout/HeaderComponent/reducer";
import { GET_MY_INFO_ERROR } from '@containers/Layout/HeaderComponent/HeaderProvider/constants';

export default function createReducer(injectedReducers = {}) {
  const appReducer = combineReducers({
    toggleSider: toggleSiderReducer,
    permission: getPermissionReducer,
    router: connectRouter(history),
    ...injectedReducers
  });

  const rootReducer = (state, action) => {
    if (action.type === GET_MY_INFO_ERROR) {
      state = undefined;
    }
    return appReducer(state, action);
  };

  return rootReducer

}
