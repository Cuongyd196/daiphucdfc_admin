import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDanhMucGia = state => state.danhmucgia || initialState;

export const selectDMGia = createSelector(
  [selectDanhMucGia],
  danhmucgiaState => danhmucgiaState.dmgia
);


