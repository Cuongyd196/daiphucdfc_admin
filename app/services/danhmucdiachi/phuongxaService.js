import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  return axios.get(`${API.DANHMUC_PHUONGXA_QUERY.format(page, limit, query)}`).then(res => {
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
  return axios.post(`${API.DANHMUC_PHUONGXA}`, data).then(res => {
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
  return axios.get(`${API.DANHMUC_PHUONGXA_ID.format(id)}`).then(res => {
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

export function delById(id) {
  return axios.delete(`${API.DANHMUC_PHUONGXA_ID.format(id)}`).then(res => {
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
  return axios.put(`${API.DANHMUC_PHUONGXA_ID.format(id)}`, data).then(res => {
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

export function getAllPhuongXaById(id) {
    return axios.get(`${API.DANHMUC_PHUONGXA_ID.format(id)}/dmphuongxa`, {
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