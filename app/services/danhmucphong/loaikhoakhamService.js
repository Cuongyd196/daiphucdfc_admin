import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
    query = query ? query : ''
    return axios.get(`${API.DANHMUC_LOAIKHOA_QUERY.format(page, limit, query)}`).then(res => {
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
    return axios.post(`${API.DANHMUC_LOAIKHOA}`, data).then(res => {
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
    return axios.get(`${API.DANHMUC_LOAIKHOA_ID.format(id)}`).then(res => {
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

export function getAllKhoaKhamById(id) {
    return axios.get(`${API.DANHMUC_LOAIKHOA_ID.format(id)}/dmkhoakham`, {
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
