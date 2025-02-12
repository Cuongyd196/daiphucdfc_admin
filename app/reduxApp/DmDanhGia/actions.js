import {
    FETCH_DMDANHGIA,
    FETCH_DMDANHGIA_SUCCESS,
    FETCH_DMDANHGIA_ERROR,
  } from "./constants";

  export function fetchDmDanhGia() {
    return {
      type: FETCH_DMDANHGIA
    };
  }
  
  export function fetchDmDanhGiaSuccess(data) {
    return {
      type: FETCH_DMDANHGIA_SUCCESS,
      data
    };
  }
  
  export function fetchDmDanhGiaError(error) {
    return {
      type: FETCH_DMDANHGIA_ERROR,
      error
    };
  }
