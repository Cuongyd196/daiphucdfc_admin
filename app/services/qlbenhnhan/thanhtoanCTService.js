import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  return axios.get(`${API.THANHTOAN_CT_QUERY.format(page, limit, query)}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}

export function getCls(id) {
  return axios.get(`${API.THANHTOAN_CT_CLS.format(id)}`,
    { loading: false })
    .then(res => {
      if (res.data) {
        return res.data;
      }
      else {
        return null;
      }
    })
    .catch(error => {
      return null;
    });
}

