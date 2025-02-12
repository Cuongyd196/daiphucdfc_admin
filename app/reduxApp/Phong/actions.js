import {
    FETCH_KHOA,
    FETCH_KHOA_SUCCESS,
    FETCH_KHOA_ERROR,
    FETCH_LOAIKHOA,
    FETCH_LOAIKHOA_SUCCESS,
    FETCH_LOAIKHOA_ERROR,
    FETCH_SPHONG,
    FETCH_SPHONG_SUCCESS,
    FETCH_SPHONG_ERROR,
  } from "./constants";
  
  export function fetchKhoa() {
    return {
      type: FETCH_KHOA
    };
  }
  
  export function fetchKhoaSuccess(data) {
    return {
      type: FETCH_KHOA_SUCCESS,
      data
    };
  }
  
  export function fetchKhoaError(error) {
    return {
      type: FETCH_KHOA_ERROR,
      error
    };
  }
  
  export function fetchLoaiKhoa() {
    return {
      type: FETCH_LOAIKHOA
    };
  }
  
  export function fetchLoaiKhoaSuccess(data) {
    return {
      type: FETCH_LOAIKHOA_SUCCESS,
      data
    };
  }
  
  export function fetchLoaiKhoaError(error) {
    return {
      type: FETCH_LOAIKHOA_ERROR,
      error
    };
  }
  
  export function fetchSPhong() {
    return {
      type: FETCH_SPHONG
    };
  }
  
  export function fetchSPhongSuccess(data) {
    return {
      type: FETCH_SPHONG_SUCCESS,
      data
    };
  }
  
  export function fetchSPhongError(error) {
    return {
      type: FETCH_SPHONG_ERROR,
      error
    };
  }