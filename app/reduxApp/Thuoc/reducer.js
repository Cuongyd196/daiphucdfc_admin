import produce from "immer";

import { FETCH_DV_SUCCESS, FETCH_LOAIDV_SUCCESS, FETCH_NHOMTHUOC_SUCCESS, FETCH_HOATCHAT_SUCCESS, FETCH_DVT_SUCCESS, FETCH_DUONGDUNG_SUCCESS } from "./constants";

export const initialState = {
  loaidv: [],
  nhomthuoc: [],
  hoatchat: [],
  dvt: [],
  dv: [],
  duongdung: [],
};

const benhReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_LOAIDV_SUCCESS:
        draft.loaidv = action.data;
        break;

      case FETCH_NHOMTHUOC_SUCCESS:
        draft.nhomthuoc = action.data;
        break;
      
      case FETCH_HOATCHAT_SUCCESS:
        draft.hoatchat = action.data;
        break;

      case FETCH_DVT_SUCCESS:
        draft.dvt = action.data;
        break;

      case FETCH_DV_SUCCESS:
        draft.dv = action.data;
        break;

      case FETCH_DUONGDUNG_SUCCESS:
        draft.duongdung = action.data;
        break;
    }
  });

export default benhReducer;
