import produce from "immer";

import { FETCH_PHAI_SUCCESS } from "./constants";

export const initialState = {
  phai: [],
};

const phaiReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_PHAI_SUCCESS:
        draft.phai = action.data;
        break;
    }
  });

export default phaiReducer;
