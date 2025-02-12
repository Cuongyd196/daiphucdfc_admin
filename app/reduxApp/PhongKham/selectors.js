import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectPhongKham = state => state.phong || initialState;

export const selectPhong = createSelector(
  [selectPhongKham],
  phongState => phongState.phong
);


