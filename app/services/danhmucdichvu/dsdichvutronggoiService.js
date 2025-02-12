import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
    query = query ? query : ''
    return axios.get(`${API.DS_DICH_VU_QUERY.format(page, limit, query)}`).then(res => {
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

export function getById(id) {
    return axios.get(`${API.DS_DICH_VU_ID.format(id)}`).then(res => {
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

  
export function deleteById(id) {
  return axios
    .delete(`${API.DS_DICH_VU_ID.format(id)}`)
    .then(res => {
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
      