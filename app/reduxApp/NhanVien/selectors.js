import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDoiTuong = state => state.nhanvien || initialState;

export const selectNhanVien = createSelector(
  [selectDoiTuong],
  nhanvienState => nhanvienState.nhanvien
);


