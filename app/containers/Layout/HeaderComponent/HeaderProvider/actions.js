import {
  GET_MY_INFO, GET_MY_INFO_ERROR, GET_MY_INFO_SUCCESS,

  UPDATE_MY_INFO, UPDATE_MY_INFO_SUCCESS, UPDATE_MY_INFO_ERROR,
  GET_PERMISSION_ERROR, GET_PERMISSION_SUCCESS
} from './constants';

export function loadMyInfo(id) {
  return {
    type: GET_MY_INFO,
    id,
  };
}

export function myInfoLoaded(dataRes) {
  return {
    type: GET_MY_INFO_SUCCESS,
    dataRes,
  };
}

export function myInfoLoadingError(error) {
  return {
    type: GET_MY_INFO_ERROR,
    error,
  };
}

export function updateMyInfo(data) {
  return {
    type: UPDATE_MY_INFO,
    data,
  };
}

export function updateMyInfoSuccess(dataRes) {
  return {
    type: UPDATE_MY_INFO_SUCCESS,
    dataRes,
  };
}

export function updateMyInfoError(error) {
  return {
    type: UPDATE_MY_INFO_ERROR,
    error,
  };
}

export function permissionSuccess(data) {
  return {
    type: GET_PERMISSION_SUCCESS,
    data,
  };
}

export function permissionError(error) {
  return {
    type: GET_PERMISSION_ERROR,
    error,
  };
}
