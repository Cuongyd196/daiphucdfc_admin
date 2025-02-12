import produce from "immer";

import { FETCH_NHANVIEN_SUCCESS } from "./constants";

export const initialState = {
  nhanvien: [],
};

const nhanvienReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_NHANVIEN_SUCCESS:
        draft.nhanvien = action.data;
        break;
    }
  });

export default nhanvienReducer;
