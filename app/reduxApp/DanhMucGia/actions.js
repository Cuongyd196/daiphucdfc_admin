import {
    FETCH_DANHMUCGIA,
    FETCH_DANHMUCGIA_SUCCESS,
    FETCH_DANHMUCGIA_ERROR,
  } from "./constants";
  
  export function fetchDMGia() {
    return {
      type: FETCH_DANHMUCGIA
    };
  }
  
  export function fetchDMGiaSuccess(data) {
    return {
      type: FETCH_DANHMUCGIA_SUCCESS,
      data
    };
  }
  
  export function fetchDMGiaError(error) {
    return {
      type: FETCH_DANHMUCGIA_ERROR,
      error
    };
  }
