import {
    FETCH_DMHUONGDAN,
    FETCH_DMHUONGDAN_SUCCESS,
    FETCH_DMHUONGDAN_ERROR,
  } from "./constants";
  
  export function fetchDmHuongDan() {
    return {
      type: FETCH_DMHUONGDAN
    };
  }
  
  export function fetchDmHuongDanSuccess(data) {
    return {
      type: FETCH_DMHUONGDAN_SUCCESS,
      data
    };
  }
  
  export function fetchDmHuongDanError(error) {
    return {
      type: FETCH_DMHUONGDAN_ERROR,
      error
    };
  }

