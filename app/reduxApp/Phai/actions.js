import {
    FETCH_PHAI,
    FETCH_PHAI_SUCCESS,
    FETCH_PHAI_ERROR,
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

