// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, takeLatest } from "redux-saga/effects";

import { getAll as getAllDmDanhGia } from "@services/danhmucchung/danhgia/danhgiaService";

import { FETCH_DANTOC, FETCH_DMDANHGIA } from "./constants";
import {
  fetchDmDanhGiaSuccess,
  fetchDmDanhGiaError,
} from "./actions";

export function* fetchDmDanhGia() {
  try {
    const dmdanhgiaRes = yield call(getAllDmDanhGia, 1, 0, '&trangthai=true');
    if (dmdanhgiaRes && dmdanhgiaRes.docs) {
      yield put(fetchDmDanhGiaSuccess(dmdanhgiaRes.docs));
    } else {
      yield put(fetchDmDanhGiaError());
    }
  } catch (error) {
    yield put(fetchDmDanhGiaError(error));
  }
}

export default function* dmdanhgiaSaga() {
  yield takeLatest(FETCH_DMDANHGIA, fetchDmDanhGia);
}
