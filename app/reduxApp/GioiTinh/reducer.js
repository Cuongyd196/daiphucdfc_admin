import produce from "immer";

import { FETCH_PHAI_SUCCESS, FETCH_DANTOC_SUCCESS, FETCH_QUOCTICH_SUCCESS , FETCH_NGHENGHIEP_SUCCESS, FETCH_NHANVIEN_SUCCESS } from "./constants";

export const initialState = {
  phai: [],
  dantoc: [],
  quoctich: [],
  nghenghiep: [],
  nhanvien: [],
};

const gioitinhReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_PHAI_SUCCESS:
        draft.phai = action.data;
        break;

      case FETCH_DANTOC_SUCCESS:
        draft.dantoc = action.data;
        break;

      case FETCH_QUOCTICH_SUCCESS:
        draft.quoctich = action.data;
        break;

      case FETCH_NGHENGHIEP_SUCCESS:
        draft.nghenghiep = action.data;
        break;

      case FETCH_NHANVIEN_SUCCESS:
        draft.nhanvien = action.data;
        break;
    }
  });

export default gioitinhReducer;
