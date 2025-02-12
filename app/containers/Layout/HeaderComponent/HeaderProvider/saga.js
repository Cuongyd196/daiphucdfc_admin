import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { API } from '@api';
import { GET_MY_INFO, UPDATE_MY_INFO } from './constants';
import {
  myInfoLoaded, myInfoLoadingError, updateMyInfoSuccess, updateMyInfoError,
  permissionSuccess, permissionError,
} from './actions';
import { uploadImage, uploadImages } from '@services/uploadServices';
import { updateById, updateAvatarById } from '@services/userService';

export function* getInfo() {
  const response = yield call(() => axios.get(API.USER_INFO));
  if (response && response.status === 200) {
    let dataUser = response.data;
    let data = dataUser?.role_id?.vaitro;
    yield all([
      put(myInfoLoaded(dataUser)),
      put(permissionSuccess(data)),
    ]);
  } else {
    yield put(myInfoLoadingError());
    yield put(permissionError());
  }
}

export function* updateInfo(action) {
  const { data } = action;
  const { _id, avatarFile, ...userData } = data;
  try {
    let avatarId;
    if (avatarFile) {
      const image_id = yield call(uploadImage, avatarFile);
      if (image_id) userData.avatar = image_id;
      console.log(image_id, 'image_id', userData);
    }
    const responseData = yield call(updateById, _id, userData);
    yield put(updateMyInfoSuccess(responseData));
  } catch (e) {
    yield put(updateMyInfoError());
  }
}

export default function* saga() {
  yield all([
    takeLatest(GET_MY_INFO, getInfo),
    takeLatest(UPDATE_MY_INFO, updateInfo),
  ]);
}
