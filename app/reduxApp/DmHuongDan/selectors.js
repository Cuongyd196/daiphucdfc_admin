import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDmHuongDanStore = state => state.dmhuongdan || initialState;

export const selectDmHuongDan = createSelector(
  [selectDmHuongDanStore],
  state => state.dmhuongdan
);
