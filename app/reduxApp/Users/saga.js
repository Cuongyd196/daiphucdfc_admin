// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllUser } from "@services/userService";

import { FETCH_USER } from "./constants";
import {
  fetchUserSuccess,
  fetchUserError,
} from "./actions";

export function* fetchUser() {
  try {
    const userRes = yield call(getAllUser, 1, 0);
    if (userRes && userRes.docs) {
      yield put(fetchUserSuccess(userRes.docs));
    } else {
      yield put(fetchUserError());
    }
  } catch (error) {
    yield put(fetchUserError(error));
  }
}

export default function* userSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
}
