// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, takeLatest } from "redux-saga/effects";

import { getAll as getAllTinhThanh } from "@services/danhmucdiachi/tinhthanhService";

import { FETCH_TINHTHANH } from "./constants";
import {
  fetchTinhThanhSuccess,
  fetchTinhThanhError,
} from "./actions";

export function* fetchTinhThanh() {
  try {
    const tinhthanhRes = yield call(getAllTinhThanh, 1, 0);
    if (tinhthanhRes && tinhthanhRes.docs) {
      yield put(fetchTinhThanhSuccess(tinhthanhRes.docs));
    } else {
      yield put(fetchTinhThanhError());
    }
  } catch (error) {
    yield put(fetchTinhThanhError(error));
  }
}

export default function* tinhthanhSaga() {
  yield takeLatest(FETCH_TINHTHANH, fetchTinhThanh);
}
