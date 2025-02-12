import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDiaChi = state => state.tinhthanh || initialState;

export const selectTinhThanh = createSelector(
  [selectDiaChi],
  tinhthanhState => tinhthanhState.tinhthanh
);


