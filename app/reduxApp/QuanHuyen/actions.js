import {
    FETCH_QUANHUYEN,
    FETCH_QUANHUYEN_SUCCESS,
    FETCH_QUANHUYEN_ERROR,
  } from "./constants";
  
  export function fetchQuanHuyen() {
    return {
      type: FETCH_QUANHUYEN
    };
  }
  
  export function fetchQuanHuyenSuccess(data) {
    return {
      type: FETCH_QUANHUYEN_SUCCESS,
      data
    };
  }
  
  export function fetchQuanHuyenError(error) {
    return {
      type: FETCH_QUANHUYEN_ERROR,
      error
    };
  }