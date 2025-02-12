import axios from 'axios';
import { API } from '@api';

export function dashboardLichHen(params) {
  return axios
    .get(`${API.DASHBOARD_LICH_HEN}`, {params})
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

export function dashboardThongke(params) {
  return axios
    .get(`${API.DASHBOARD_THONG_KE}`, {params})
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

export function dashboardDichVu(type) {
  return axios
    .post(`${API.DASHBOARD_DICH_VU}`, type)
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

export function dashboardDanhGia(params) {
  return axios
    .get(`${API.DASHBOARD_DANHGIA}`, {params})
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

export function dashboardDangKy(params) {
  return axios
    .get(`${API.DASHBOARD_DANGKY}`, {params})
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
