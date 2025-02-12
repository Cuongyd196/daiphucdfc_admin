import axios from 'axios';
import { API } from '@api';

export function add(data) {
    return axios.post(`${API.THONG_TIN_UNG_DUNG}`, data).then(res => {
        if(res.data){
            return res.data;
        } else {
            return null
        }
    }).catch(error => {
        return null
    });
}

export function getOne(query) {
  query = query ? query : ''
  return axios.get(`${API.THONG_TIN_UNG_DUNG_QUERY.format(query)}`).then(res => {
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

export function update(data) {
    return axios.put(`${API.THONG_TIN_UNG_DUNG}`, data).then(res => {
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
