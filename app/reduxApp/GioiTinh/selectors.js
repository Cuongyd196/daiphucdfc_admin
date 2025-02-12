import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectGioiTinh = state => state.gioitinh || initialState;

export const selectPhai = createSelector(
  [selectGioiTinh],
  gioitinhState => gioitinhState.phai
);

export const selectDanToc = createSelector(
  [selectGioiTinh],
  gioitinhState => gioitinhState.dantoc
);

export const selectQuocTich = createSelector(
  [selectGioiTinh],
  gioitinhState => gioitinhState.quoctich
);

export const selectNgheNghiep = createSelector(
  [selectGioiTinh],
  gioitinhState => gioitinhState.nghenghiep
);

export const selectNhanVien = createSelector(
  [selectGioiTinh],
  gioitinhState => gioitinhState.nhanvien
);


