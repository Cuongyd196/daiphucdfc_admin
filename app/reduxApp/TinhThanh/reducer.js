import produce from "immer";

import { FETCH_TINHTHANH_SUCCESS } from "./constants";

export const initialState = {
  tinhthanh: [],
};

const tinhthanhReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_TINHTHANH_SUCCESS:
        draft.tinhthanh = action.data;
        break;
    }
  });

export default tinhthanhReducer;
