// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, takeLatest } from "redux-saga/effects";

import { getAll as getAllPhai } from "@services/danhmuchanhchinh/danhmucphaiService";

import { FETCH_PHAI} from "./constants";
import {
  fetchPhaiSuccess,
  fetchPhaiError,
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

export default function* phaiSaga() {
  yield takeLatest(FETCH_PHAI, fetchPhai);
}
