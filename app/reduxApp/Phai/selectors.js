import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectGioiTinh = state => state.phai || initialState;

export const selectPhai = createSelector(
  [selectGioiTinh],
  phaiState => phaiState.phai
);
