// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllLoaiKhoa } from "@services/danhmucphong/loaikhoakhamService";
import { getAll as getAllKhoa } from "@services/danhmucphong/khoakhamService";
import { getAll as getAllPhong } from "@services/danhmucphong/phongService";

import { FETCH_LOAIKHOA, FETCH_KHOA, FETCH_SPHONG } from "./constants";
import {
  fetchLoaiKhoaSuccess,
  fetchLoaiKhoaError,
  fetchKhoaSuccess,
  fetchKhoaError,
  fetchSPhongSuccess,
  fetchSPhongError,
} from "./actions";

export function* fetchLoaiKhoa() {
  try {
    const loaikhoaRes = yield call(getAllLoaiKhoa, 1, 0);
    if (loaikhoaRes && loaikhoaRes.docs) {
      yield put(fetchLoaiKhoaSuccess(loaikhoaRes.docs));
    } else {
      yield put(fetchLoaiKhoaError());
    }
  } catch (error) {
    yield put(fetchLoaiKhoaError(error));
  }
}


export function* fetchKhoa() {
  try {
    const khoaRes = yield call(getAllKhoa, 1, 0);
    if (khoaRes && khoaRes.docs) {
      yield put(fetchKhoaSuccess(khoaRes.docs));
    } else {
      yield put(fetchKhoaError());
    }
  } catch (error) {
    yield put(fetchKhoaError(error));
  }
}

export function* fetchSPhong() {
  try {
    const sphongRes = yield call(getAllPhong, 1, 0);
    if (sphongRes && sphongRes.docs) {
      yield put(fetchSPhongSuccess(sphongRes.docs));
    } else {
      yield put(fetchSPhongError());
    }
  } catch (error) {
    yield put(fetchSPhongError(error));
  }
}

export default function* phongSaga() {
  yield takeLatest(FETCH_LOAIKHOA, fetchLoaiKhoa);
  yield takeLatest(FETCH_KHOA, fetchKhoa);
  yield takeLatest(FETCH_SPHONG, fetchSPhong);
}
