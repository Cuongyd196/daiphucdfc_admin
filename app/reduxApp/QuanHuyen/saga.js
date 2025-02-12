// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, takeLatest } from "redux-saga/effects";

import { getAll as getAllQuanHuyen } from "@services/danhmucdiachi/quanhuyenService";

import { FETCH_QUANHUYEN } from "./constants";
import {
  fetchQuanHuyenSuccess,
  fetchQuanHuyenError,
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

export default function* quanhuyenSaga() {
  yield takeLatest(FETCH_QUANHUYEN, fetchQuanHuyen);
}
