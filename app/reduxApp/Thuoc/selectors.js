import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectThuoc = state => state.thuoc || initialState;

export const selectLoaiDV = createSelector(
  [selectThuoc],
  thuocState => thuocState.loaidv
);

export const selectNhomThuoc = createSelector(
  [selectThuoc],
  thuocState => thuocState.nhomthuoc
);

export const selectHoatChat = createSelector(
  [selectThuoc],
  thuocState => thuocState.hoatchat
);

export const selectDVT = createSelector(
  [selectThuoc],
  thuocState => thuocState.dvt
);

export const selectDV = createSelector(
  [selectThuoc],
  thuocState => thuocState.dv
);

export const selectDuongDung = createSelector(
  [selectThuoc],
  thuocState => thuocState.duongdung
);


