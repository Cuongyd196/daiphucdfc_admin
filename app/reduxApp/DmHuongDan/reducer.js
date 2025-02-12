import produce from "immer";

import { FETCH_DMHUONGDAN_SUCCESS } from "./constants";

export const initialState = {
  dmhuongdan: [],
};

const phaiReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_DMHUONGDAN_SUCCESS:
        draft.dmhuongdan = action.data;
        break;
    }
  });

export default phaiReducer;
