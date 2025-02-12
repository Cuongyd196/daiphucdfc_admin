import {
    FETCH_NHANVIEN,
    FETCH_NHANVIEN_SUCCESS,
    FETCH_NHANVIEN_ERROR,
  } from "./constants";

  export function fetchNhanVien() {
    return {
      type: FETCH_NHANVIEN
    };
  }
  
  export function fetchNhanVienSuccess(data) {
    return {
      type: FETCH_NHANVIEN_SUCCESS,
      data
    };
  }
  
  export function fetchNhanVienError(error) {
    return {
      type: FETCH_NHANVIEN_ERROR,
      error
    };
  }
  
  