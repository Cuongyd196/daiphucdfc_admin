import axios from 'axios';
import { API } from '@api';

export function getAllLichBacSiNghi(query) {
  query = query ? query : '';
  return axios
    .get(`${API.LICH_BAC_SI_NGHI}${query}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function addLichBacSiNghi(data) {
  return axios
    .post(`${API.LICH_BAC_SI_NGHI}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function updateLichBacSiNghi(id, data){
  return axios
    .put(`${API.LICH_BAC_SI_NGHI_ID.format(id)}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function deleteLichBacSiNghi(id){
  return axios
    .delete(`${API.LICH_BAC_SI_NGHI_ID.format(id)}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getLichLamViec(query){
  return axios
    .get(`/api/quan-ly-lich-lam-viec/thoi-gian?${query}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}
