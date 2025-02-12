import produce from "immer";

import { FETCH_USER_SUCCESS } from "./constants";

export const initialState = {
  user: [],
};

const userReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_USER_SUCCESS:
        draft.user = action.data;
        break;
    }
  });

export default userReducer;
