// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, takeLatest } from "redux-saga/effects";
import { getAll as getAllPhong } from "@services/danhmucphong/phongService";

import { FETCH_PHONG } from "./constants";
import {
  fetchPhongSuccess,
  fetchPhongError,
} from "./actions";

export function* fetchPhong() {
  try {
    const phongRes = yield call(getAllPhong, 1, 0);
    if (phongRes && phongRes.docs) {
      yield put(fetchPhongSuccess(phongRes.docs));
    } else {
      yield put(fetchPhongError());
    }
  } catch (error) {
    yield put(fetchPhongError(error));
  }
}

export default function* phongSaga() {
  yield takeLatest(FETCH_PHONG, fetchPhong);
}
