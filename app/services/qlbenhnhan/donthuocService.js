import axios from 'axios';
import { API } from '@api';



export function getById(id) {
  return axios.get(`${API.DONTHUOC_ID.format(id)}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

export function getGhiChuDonTHuoc(id) {
  return axios.get(`${API.GHICHU_DONTHUOC_ID.format(id)}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}
