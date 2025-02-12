import axios from 'axios';
import { API } from '@api';

export function getAllLichLamViec(page, limit, query) {
  return axios
    .get(`${API.QL_LICH_LAM_VIEC_QUERY.format(page, limit, query)}`)
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

export function getAllTheJobs(id, query) {
  return axios
    .get(`${API.QL_LICH_LAM_VIEC + '?all=true' + query}`)
    .then(res => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function getByIdLichLamViec(id) {
  return axios
    .get(`${API.QL_LICH_LAM_VIEC_ID.format(id)}`)
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

export function addLichLamViec(data) {
  return axios
    .post(`${API.QL_LICH_LAM_VIEC}`, data)
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

export function updateByIdLichLamViec(id, data) {
  return axios
    .put(`${API.QL_LICH_LAM_VIEC_ID.format(id)}`, data)
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

export function delByIdLichLamViec(id) {
  return axios
    .delete(`${API.QL_LICH_LAM_VIEC_ID.format(id)}`)
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
