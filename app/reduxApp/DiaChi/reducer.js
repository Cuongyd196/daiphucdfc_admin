import produce from "immer";

import { FETCH_QUANHUYEN_SUCCESS, FETCH_TINHTHANH_SUCCESS, FETCH_PHUONGXA_SUCCESS } from "./constants";

export const initialState = {
  quanhuyen: [],
  tinhthanh: [],
  phuongxa: [],
};

const diachiReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_TINHTHANH_SUCCESS:
        draft.tinhthanh = action.data;
        break;

      case FETCH_QUANHUYEN_SUCCESS:
        draft.quanhuyen = action.data;
        break;

      case FETCH_PHUONGXA_SUCCESS:
        draft.phuongxa = action.data;
        break;
    }
  });

export default diachiReducer;
