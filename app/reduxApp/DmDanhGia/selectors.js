import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDanhGia= state => state.dmdanhgia || initialState;

export const selectDmDanhGia = createSelector(
  [selectDanhGia],
  dmdanhgiaState => dmdanhgiaState.dmdanhgia
);

