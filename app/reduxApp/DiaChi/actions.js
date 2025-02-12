import {
    FETCH_TINHTHANH,
    FETCH_TINHTHANH_SUCCESS,
    FETCH_TINHTHANH_ERROR,
    FETCH_QUANHUYEN,
    FETCH_QUANHUYEN_SUCCESS,
    FETCH_QUANHUYEN_ERROR,
    FETCH_PHUONGXA,
    FETCH_PHUONGXA_SUCCESS,
    FETCH_PHUONGXA_ERROR,
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

  export function fetchPhuongXa() {
    return {
      type: FETCH_PHUONGXA
    };
  }
  
  export function fetchPhuongXaSuccess(data) {
    return {
      type: FETCH_PHUONGXA_SUCCESS,
      data
    };
  }
  
  export function fetchPhuongXaError(error) {
    return {
      type: FETCH_PHUONGXA_ERROR,
      error
    };
  }
  