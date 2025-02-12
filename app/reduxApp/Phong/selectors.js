import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectPhong = state => state.phong || initialState;

export const selectLoaiKhoa = createSelector(
  [selectPhong],
  phongState => phongState.loaikhoa
);

export const selectKhoa = createSelector(
  [selectPhong],
  phongState => phongState.khoa
);

export const selectSPhong = createSelector(
  [selectPhong],
  phongState => phongState.sphong
);


