import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
    query = query ? query : ''
    return axios.get(`${API.DANHMUC_NHOMBAOHIEM_QUERY.format(page, limit, query)}`).then(res => {
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
  
export function add(data) {
    return axios.post(`${API.DANHMUC_NHOMBAOHIEM}`, data).then(res => {
        if(res.data){
            return res.data;
        } else {
            return null
        }
    }).catch(error => {
        return null
    });
}

export function getById(id) {
    return axios.get(`${API.DANHMUC_NHOMBAOHIEM_ID.format(id)}`).then(res => {
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
export  function getAllDichVuById(id) {
    return axios.get(`${API.DANHMUC_NHOMBAOHIEM_ID.format(id)}/dmdichvu`, {
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