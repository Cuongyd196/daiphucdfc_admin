import axios from 'axios';
import { API } from '@api';

export function getAll(query) {
  return axios.get(`${API.THONGBAOCHUNG_QUERY.format(query)}`).then(res => {
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
  return axios.post(`${API.THONGBAOCHUNG}`, data).then(res => {
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
  return axios.get(`${API.THONGBAOCHUNG_ID.format(id)}`).then(res => {
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
  return axios.delete(`${API.THONGBAOCHUNG_ID.format(id)}`).then(res => {
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
  return axios.put(`${API.THONGBAOCHUNG_ID.format(id)}`, data).then(res => {
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

