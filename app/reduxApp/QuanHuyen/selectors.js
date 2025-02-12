import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDiaChi = state => state.quanhuyen || initialState;

export const selectQuanHuyen = createSelector(
  [selectDiaChi],
  quanhuyenState => quanhuyenState.quanhuyen
);



