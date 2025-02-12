import {
    FETCH_PHAI,
    FETCH_PHAI_SUCCESS,
    FETCH_PHAI_ERROR,
    FETCH_DANTOC,
    FETCH_DANTOC_SUCCESS,
    FETCH_DANTOC_ERROR,
    FETCH_QUOCTICH,
    FETCH_QUOCTICH_SUCCESS,
    FETCH_QUOCTICH_ERROR,
    FETCH_NGHENGHIEP,
    FETCH_NGHENGHIEP_SUCCESS,
    FETCH_NGHENGHIEP_ERROR,
    FETCH_NHANVIEN,
    FETCH_NHANVIEN_SUCCESS,
    FETCH_NHANVIEN_ERROR,
  } from "./constants";
  
  export function fetchPhai() {
    return {
      type: FETCH_PHAI
    };
  }
  
  export function fetchPhaiSuccess(data) {
    return {
      type: FETCH_PHAI_SUCCESS,
      data
    };
  }
  
  export function fetchPhaiError(error) {
    return {
      type: FETCH_PHAI_ERROR,
      error
    };
  }

  export function fetchDanToc() {
    return {
      type: FETCH_DANTOC
    };
  }
  
  export function fetchDanTocSuccess(data) {
    return {
      type: FETCH_DANTOC_SUCCESS,
      data
    };
  }
  
  export function fetchDanTocError(error) {
    return {
      type: FETCH_DANTOC_ERROR,
      error
    };
  }

  export function fetchQuocTich() {
    return {
      type: FETCH_QUOCTICH
    };
  }
  
  export function fetchQuocTichSuccess(data) {
    return {
      type: FETCH_QUOCTICH_SUCCESS,
      data
    };
  }
  
  export function fetchQuocTichError(error) {
    return {
      type: FETCH_QUOCTICH_ERROR,
      error
    };
  }

  export function fetchNgheNghiep() {
    return {
      type: FETCH_NGHENGHIEP
    };
  }
  
  export function fetchNgheNghiepSuccess(data) {
    return {
      type: FETCH_NGHENGHIEP_SUCCESS,
      data
    };
  }
  
  export function fetchNgheNghiepError(error) {
    return {
      type: FETCH_NGHENGHIEP_ERROR,
      error
    };
  }

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
  
  