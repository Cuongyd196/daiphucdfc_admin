import produce from "immer";

import { FETCH_QUANHUYEN_SUCCESS } from "./constants";

export const initialState = {
  quanhuyen: [],
};

const quanhuyenReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_QUANHUYEN_SUCCESS:
        draft.quanhuyen = action.data;
        break;
    }
  });

export default quanhuyenReducer;
