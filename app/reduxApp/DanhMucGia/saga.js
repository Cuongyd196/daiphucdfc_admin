// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllDanhMucGia } from "@services/danhmucdichvu/dmgiaService";

import { FETCH_DANHMUCGIA } from "./constants";
import {
  fetchDMGiaSuccess,
  fetchDMGiaError,
} from "./actions";

export function* fetchDMGia() {
  try {
    const dmGiaRes = yield call(getAllDanhMucGia, 1, 0);
    if (dmGiaRes && dmGiaRes.docs) {
      yield put(fetchDMGiaSuccess(dmGiaRes.docs));
    } else {
      yield put(fetchDMGiaError());
    }
  } catch (error) {
    yield put(fetchDMGiaError(error));
  }
}

export default function* danhmucgiaSaga() {
  yield takeLatest(FETCH_DANHMUCGIA, fetchDMGia);
}
