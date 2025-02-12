import axios from "axios";
import { API } from "@api";

//dị ứng
export function getDiUng(page, limit, query) {
  return axios
    .get(`${API.DIUNG.format(page, limit, query)}`)

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

export function getHoSoNguoiThan(page, limit, query) {
  return axios
    .get(`${API.HOSONGUOITHAN.format(page, limit, query)}`)

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


export function getKetQuaKham(page, limit, query) {
  return axios
    .get(`${API.KETQUAKHAMBENH.format(page, limit, query)}`)

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


export function getPTCG(page, limit, query) {
  return axios
    .get(`${API.PHAUTHUATCAYGHEP.format(page, limit, query)}`)

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

