import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDiaChi = state => state.diachi || initialState;

export const selectQuanHuyen = createSelector(
  [selectDiaChi],
  diachiState => diachiState.quanhuyen
);

export const selectTinhThanh = createSelector(
  [selectDiaChi],
  diachiState => diachiState.tinhthanh
);

export const selectPhuongXa = createSelector(
  [selectDiaChi],
  diachiState => diachiState.phuongxa
);


