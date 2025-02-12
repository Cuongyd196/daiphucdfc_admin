import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  return axios.get(`${API.QL_DONTHUOC_QUERY.format(page, limit, query)}`).then(res => {
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

export  function getChiTietDonThuocId(id) {
  return axios.get(`${API.QL_DONTHUOC_ID.format(id)}`, {
    loading: false
  }).then(res => {
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

