// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, takeLatest } from "redux-saga/effects";

import { getAll as getAll } from "@services/huongdankhambenh/danhmuchuongdanService";

import { FETCH_DMHUONGDAN} from "./constants";
import {
  fetchDmHuongDanSuccess,
  fetchDmHuongDanError,
} from "./actions";

export function* fetchDmHuongDan() {
  try {
    const dmhuongdanRes = yield call(getAll, 1, 0);
    if (dmhuongdanRes && dmhuongdanRes.docs) {
      yield put(fetchDmHuongDanSuccess(dmhuongdanRes.docs));
    } else {
      yield put(fetchDmHuongDanError());
    }
  } catch (error) {
    yield put(fetchDmHuongDanError(error));
  }
}

export default function* dmhuongdanSaga() {
  yield takeLatest(FETCH_DMHUONGDAN, fetchDmHuongDan);
}
