import produce from "immer";

import { FETCH_DMDANHGIA_SUCCESS } from "./constants";

export const initialState = {
  dmdanhgia: [],
};

const dmdanhgiaReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_DMDANHGIA_SUCCESS:
        draft.dmdanhgia = action.data;
        break;
    }
  });

export default dmdanhgiaReducer;
