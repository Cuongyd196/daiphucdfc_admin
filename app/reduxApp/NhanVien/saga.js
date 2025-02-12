// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllNhanvien } from "@services/danhmucchung/nhanvienService";

import { FETCH_NHANVIEN } from "./constants";
import {
  fetchNhanVienSuccess,
  fetchNhanVienError,
} from "./actions";

export function* fetchNhanVien() {
  try {
    const nhanvienRes = yield call(getAllNhanvien, 1, 0);
    if (nhanvienRes && nhanvienRes.docs) {
      yield put(fetchNhanVienSuccess(nhanvienRes.docs));
    } else {
      yield put(fetchNhanVienError());
    }
  } catch (error) {
    yield put(fetchNhanVienError(error));
  }
}

export default function* nhanvienSaga() {
  yield takeLatest(FETCH_NHANVIEN, fetchNhanVien);
}
