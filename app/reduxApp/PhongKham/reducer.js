import produce from "immer";

import { FETCH_PHONG_SUCCESS } from "./constants";

export const initialState = {
  phong: [],
};

const phongReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_PHONG_SUCCESS:
        draft.phong = action.data;
        break;
    }
  });

export default phongReducer;
