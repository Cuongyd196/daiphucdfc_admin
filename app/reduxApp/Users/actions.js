import {
    FETCH_USER,
    FETCH_USER_SUCCESS,
    FETCH_USER_ERROR,
  } from "./constants";

  export function fetchUser() {
    return {
      type: FETCH_USER
    };
  }
  
  export function fetchUserSuccess(data) {
    return {
      type: FETCH_USER_SUCCESS,
      data
    };
  }
  
  export function fetchUserError(error) {
    return {
      type: FETCH_USER_ERROR,
      error
    };
  }
  
  