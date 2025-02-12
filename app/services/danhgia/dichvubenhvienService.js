import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
    query = query ? query : ''
    return axios.get(`${API.DANH_GIA_DICH_VU_BENH_VIEN_QUERY.format(page, limit, query)}`).then(res => {
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
    return axios.post(`${API.DANH_GIA_DICH_VU_BENH_VIEN}`, data).then(res => {
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
    return axios.get(`${API.DANH_GIA_DICH_VU_BENH_VIEN_ID.format(id)}`).then(res => {
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
  export function updateById(id, data) {
    return axios
      .put(`${API.DANH_GIA_DICH_VU_BENH_VIEN_ID.format(id)}`, data)
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

  export function danhgiadichvubv(query) {
    return axios
      .get(`${API.DANH_GIA_DICH_VU_BENH_VIEN_BV_QUERY.format(query)}`)
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

