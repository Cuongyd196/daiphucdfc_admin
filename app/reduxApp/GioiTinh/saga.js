// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllPhai } from "@services/danhmuchanhchinh/danhmucphaiService";
import { getAll as getAllDanToc } from "@services/danhmuchanhchinh/danhmucdantocService";
import { getAll as getAllQuocTich } from "@services/danhmuchanhchinh/danhmucquoctichService";
import { getAll as getAllNgheNghiep } from "@services/danhmuchanhchinh/danhmucnghenghiepService";
import { getAll as getAllNhanvien } from "@services/danhmucchung/nhanvienService";

import { FETCH_NGHENGHIEP, FETCH_PHAI, FETCH_DANTOC, FETCH_QUOCTICH, FETCH_NHANVIEN } from "./constants";
import {
  fetchPhaiSuccess,
  fetchPhaiError,
  fetchDanTocSuccess,
  fetchDanTocError,
  fetchQuocTichSuccess,
  fetchQuocTichError,
  fetchNgheNghiepSuccess,
  fetchNgheNghiepError,
  fetchNhanVienSuccess,
  fetchNhanVienError,
} from "./actions";

export function* fetchPhai() {
  try {
    const phaiRes = yield call(getAllPhai, 1, 0);
    if (phaiRes && phaiRes.docs) {
      yield put(fetchPhaiSuccess(phaiRes.docs));
    } else {
      yield put(fetchPhaiError());
    }
  } catch (error) {
    yield put(fetchPhaiError(error));
  }
}

export function* fetchDanToc() {
  try {
    const dantocRes = yield call(getAllDanToc, 1, 0);
    if (dantocRes && dantocRes.docs) {
      yield put(fetchDanTocSuccess(dantocRes.docs));
    } else {
      yield put(fetchDanTocError());
    }
  } catch (error) {
    yield put(fetchDanTocError(error));
  }
}

export function* fetchQuocTich() {
  try {
    const quoctichRes = yield call(getAllQuocTich, 1, 0);
    if (quoctichRes && quoctichRes.docs) {
      yield put(fetchQuocTichSuccess(quoctichRes.docs));
    } else {
      yield put(fetchQuocTichError());
    }
  } catch (error) {
    yield put(fetchQuocTichError(error));
  }
}

export function* fetchNgheNghiep() {
  try {
    const nghenghiepRes = yield call(getAllNgheNghiep, 1, 0);
    if (nghenghiepRes && nghenghiepRes.docs) {
      yield put(fetchNgheNghiepSuccess(nghenghiepRes.docs));
    } else {
      yield put(fetchNgheNghiepError());
    }
  } catch (error) {
    yield put(fetchNgheNghiepError(error));
  }
}

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

export default function* gioitinhSaga() {
  yield takeLatest(FETCH_PHAI, fetchPhai);
  yield takeLatest(FETCH_DANTOC, fetchDanToc);
  yield takeLatest(FETCH_QUOCTICH, fetchQuocTich);
  yield takeLatest(FETCH_NHANVIEN, fetchNhanVien);
  yield takeLatest(FETCH_NGHENGHIEP, fetchNgheNghiep);
}
