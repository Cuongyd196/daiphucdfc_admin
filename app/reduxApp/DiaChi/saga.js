// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllTinThanh } from "@services/danhmucdiachi/tinhthanhService";
import { getAll as getAllQuanHuyen } from "@services/danhmucdiachi/quanhuyenService";
import { getAll as getAllPhuongXa } from "@services/danhmucdiachi/phuongxaService";

import { FETCH_QUANHUYEN, FETCH_TINHTHANH, FETCH_PHUONGXA } from "./constants";
import {
  fetchQuanHuyenSuccess,
  fetchQuanHuyenError,
  fetchTinhThanhSuccess,
  fetchTinhThanhError,
  fetchPhuongXaSuccess,
  fetchPhuongXaError,
} from "./actions";

export function* fetchQuanHuyen() {
  try {
    const quanhuyenRes = yield call(getAllQuanHuyen, 1, 0);
    if (quanhuyenRes && quanhuyenRes.docs) {
      yield put(fetchQuanHuyenSuccess(quanhuyenRes.docs));
    } else {
      yield put(fetchQuanHuyenError());
    }
  } catch (error) {
    yield put(fetchQuanHuyenError(error));
  }
}


export function* fetchTinhThanh() {
  try {
    const tinhthanhRes = yield call(getAllTinThanh, 1, 0);
    if (tinhthanhRes && tinhthanhRes.docs) {
      yield put(fetchTinhThanhSuccess(tinhthanhRes.docs));
    } else {
      yield put(fetchTinhThanhError());
    }
  } catch (error) {
    yield put(fetchTinhThanhError(error));
  }
}

export function* fetchPhuongXa() {
  try {
    const phuongxaRes = yield call(getAllPhuongXa, 1, 0);
    if (phuongxaRes && phuongxaRes.docs) {
      yield put(fetchPhuongXaSuccess(phuongxaRes.docs));
    } else {
      yield put(fetchPhuongXaError());
    }
  } catch (error) {
    yield put(fetchPhuongXaError(error));
  }
}

export default function* diachiSaga() {
  yield takeLatest(FETCH_TINHTHANH, fetchTinhThanh);
  yield takeLatest(FETCH_QUANHUYEN, fetchQuanHuyen);
  yield takeLatest(FETCH_PHUONGXA, fetchPhuongXa);
}
