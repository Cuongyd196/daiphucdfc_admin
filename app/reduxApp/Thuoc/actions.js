import {
    FETCH_LOAIDV,
    FETCH_LOAIDV_SUCCESS,
    FETCH_LOAIDV_ERROR,
    FETCH_HOATCHAT,
    FETCH_HOATCHAT_SUCCESS,
    FETCH_HOATCHAT_ERROR,
    FETCH_NHOMTHUOC,
    FETCH_NHOMTHUOC_SUCCESS,
    FETCH_NHOMTHUOC_ERROR,
    FETCH_DVT,
    FETCH_DVT_SUCCESS,
    FETCH_DVT_ERROR,
    FETCH_DV,
    FETCH_DV_SUCCESS,
    FETCH_DV_ERROR,
    FETCH_DUONGDUNG,
    FETCH_DUONGDUNG_SUCCESS,
    FETCH_DUONGDUNG_ERROR,
  } from "./constants";
  
  export function fetchLoaiDV() {
    return {
      type: FETCH_LOAIDV
    };
  }
  
  export function fetchLoaiDVSuccess(data) {
    return {
      type: FETCH_LOAIDV_SUCCESS,
      data
    };
  }
  
  export function fetchLoaiDVError(error) {
    return {
      type: FETCH_LOAIDV_ERROR,
      error
    };
  }
  
  export function fetchHoatChat() {
    return {
      type: FETCH_HOATCHAT
    };
  }
  
  export function fetchHoatChatSuccess(data) {
    return {
      type: FETCH_HOATCHAT_SUCCESS,
      data
    };
  }
  
  export function fetchHoatChatError(error) {
    return {
      type: FETCH_HOATCHAT_ERROR,
      error
    };
  }
  
  export function fetchNhomThuoc() {
    return {
      type: FETCH_NHOMTHUOC
    };
  }
  
  export function fetchNhomThuocSuccess(data) {
    return {
      type: FETCH_NHOMTHUOC_SUCCESS,
      data
    };
  }
  
  export function fetchNhomThuocError(error) {
    return {
      type: FETCH_NHOMTHUOC_ERROR,
      error
    };
  }
  export function fetchDVT() {
    return {
      type: FETCH_DVT
    };
  }
  
  export function fetchDVTSuccess(data) {
    return {
      type: FETCH_DVT_SUCCESS,
      data
    };
  }
  
  export function fetchDVTError(error) {
    return {
      type: FETCH_DVT_ERROR,
      error
    };
  }

  export function fetchDV() {
    return {
      type: FETCH_DV
    };
  }
  
  export function fetchDVSuccess(data) {
    return {
      type: FETCH_DV_SUCCESS,
      data
    };
  }
  
  export function fetchDVError(error) {
    return {
      type: FETCH_DV_ERROR,
      error
    };
  }

  export function fetchDuongDung() {
    return {
      type: FETCH_DUONGDUNG
    };
  }
  
  export function fetchDuongDungSuccess(data) {
    return {
      type: FETCH_DUONGDUNG_SUCCESS,
      data
    };
  }
  
  export function fetchDuongDungError(error) {
    return {
      type: FETCH_DUONGDUNG_ERROR,
      error
    };
  }