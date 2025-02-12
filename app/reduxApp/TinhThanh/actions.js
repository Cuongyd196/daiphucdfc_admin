import {
    FETCH_TINHTHANH,
    FETCH_TINHTHANH_SUCCESS,
    FETCH_TINHTHANH_ERROR,
  } from "./constants";
  
  export function fetchTinhThanh() {
    return {
      type: FETCH_TINHTHANH
    };
  }
  
  export function fetchTinhThanhSuccess(data) {
    return {
      type: FETCH_TINHTHANH_SUCCESS,
      data
    };
  }
  
  export function fetchTinhThanhError(error) {
    return {
      type: FETCH_TINHTHANH_ERROR,
      error
    };
  }