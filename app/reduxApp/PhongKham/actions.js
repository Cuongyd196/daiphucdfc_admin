import {
    FETCH_PHONG,
    FETCH_PHONG_SUCCESS,
    FETCH_PHONG_ERROR,
  } from "./constants";
  
  export function fetchPhong() {
    return {
      type: FETCH_PHONG
    };
  }
  
  export function fetchPhongSuccess(data) {
    return {
      type: FETCH_PHONG_SUCCESS,
      data
    };
  }
  
  export function fetchPhongError(error) {
    return {
      type: FETCH_PHONG_ERROR,
      error
    };
  }