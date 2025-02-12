import produce from "immer";

import { FETCH_LOAIKHOA_SUCCESS, FETCH_KHOA_SUCCESS, FETCH_SPHONG_SUCCESS } from "./constants";

export const initialState = {
  loaikhoa: [],
  khoa: [],
  sphong: [],
};

const phongReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_LOAIKHOA_SUCCESS:
        draft.loaikhoa = action.data;
        break;

      case FETCH_KHOA_SUCCESS:
        draft.khoa = action.data;
        break;

      case FETCH_SPHONG_SUCCESS:
        draft.sphong = action.data;
        break;
    }
  });

export default phongReducer;
