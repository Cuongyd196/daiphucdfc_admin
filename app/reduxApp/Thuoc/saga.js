// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllLoaiDV } from "@services/danhmucdichvu/loaidichvuService";
import { getAll as getAllNhomThuoc } from "@services/danhmucthuoc/nhomthuocService";
import { getAll as getAllHoatChat } from "@services/danhmucthuoc/hoatchatService";
import { getAll as getAllDuongDung } from "@services/danhmucthuoc/duongdungService";
import { getAll as getAllDVT } from "@services/danhmucdichvu/donvitinhService";
import { getAll as getAllDV } from "@services/danhmucdichvu/dichvuService";

import { FETCH_LOAIDV, FETCH_NHOMTHUOC, FETCH_DVT, FETCH_HOATCHAT, FETCH_DUONGDUNG, FETCH_DV } from "./constants";
import {
  fetchLoaiDVSuccess,
  fetchLoaiDVError,
  fetchNhomThuocSuccess,
  fetchNhomThuocError,
  fetchHoatChatSuccess,
  fetchHoatChatError,
  fetchDVTSuccess,
  fetchDVTError,
  fetchDVSuccess,
  fetchDVError,
  fetchDuongDungSuccess,
  fetchDuongDungError,
} from "./actions";

export function* fetchLoaiDV() {
  try {
    const loaiDVRes = yield call(getAllLoaiDV, 1, 0);
    if (loaiDVRes && loaiDVRes.docs) {
      yield put(fetchLoaiDVSuccess(loaiDVRes.docs));
    } else {
      yield put(fetchLoaiDVError());
    }
  } catch (error) {
    yield put(fetchLoaiDVError(error));
  }
}


export function* fetchNhomThuoc() {
  try {
    const nhomthuocRes = yield call(getAllNhomThuoc, 1, 0);
    if (nhomthuocRes && nhomthuocRes.docs) {
      yield put(fetchNhomThuocSuccess(nhomthuocRes.docs));
    } else {
      yield put(fetchNhomThuocError());
    }
  } catch (error) {
    yield put(fetchNhomThuocError(error));
  }
}

export function* fetchHoatChat() {
  try {
    const hoatchatRes = yield call(getAllHoatChat, 1, 0);
    if (hoatchatRes && hoatchatRes.docs) {
      yield put(fetchHoatChatSuccess(hoatchatRes.docs));
    } else {
      yield put(fetchHoatChatError());
    }
  } catch (error) {
    yield put(fetchHoatChatError(error));
  }
}


export function* fetchDVT() {
  try {
    const dvtRes = yield call(getAllDVT, 1, 0);
    if (dvtRes && dvtRes.docs) {
      yield put(fetchDVTSuccess(dvtRes.docs));
    } else {
      yield put(fetchDVTError());
    }
  } catch (error) {
    yield put(fetchDVTError(error));
  }
}

export function* fetchDV() {
  try {
    const dvRes = yield call(getAllDV, 1, 0);
    if (dvRes && dvRes.docs) {
      yield put(fetchDVSuccess(dvRes.docs));
    } else {
      yield put(fetchDVError());
    }
  } catch (error) {
    yield put(fetchDVError(error));
  }
}

export function* fetchDuongDung() {
  try {
    const duongdungRes = yield call(getAllDuongDung, 1, 0);
    if (duongdungRes && duongdungRes.docs) {
      yield put(fetchDuongDungSuccess(duongdungRes.docs));
    } else {
      yield put(fetchDuongDungError());
    }
  } catch (error) {
    yield put(fetchDuongDungError(error));
  }
}

export default function* thuocSaga() {
  yield takeLatest(FETCH_LOAIDV, fetchLoaiDV);
  yield takeLatest(FETCH_NHOMTHUOC, fetchNhomThuoc);
  yield takeLatest(FETCH_HOATCHAT, fetchHoatChat);
  yield takeLatest(FETCH_DVT, fetchDVT);
  yield takeLatest(FETCH_DV, fetchDV);
  yield takeLatest(FETCH_DUONGDUNG, fetchDuongDung);
}
