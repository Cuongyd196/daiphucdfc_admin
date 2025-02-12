import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  return axios.get(`${API.QL_DANGKYKHAM_QUERY.format(page, limit, query)}`).then(res => {
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
  return axios.post(`${API.QL_DANGKYKHAM}`, data).then(res => {
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
  return axios.get(`${API.QL_DANGKYKHAM_ID.format(id)}`).then(res => {
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
  return axios.delete(`${API.QL_DANGKYKHAM_ID.format(id)}`).then(res => {
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
  return axios.put(`${API.QL_DANGKYKHAM_ID.format(id)}`, data).then(res => {
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


export  function getChiTietKhamBenhId(id) {
  return axios.get(`${API.QL_DANGKYKHAM_ID.format(id)}/chitiet`, {
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

export  function getHenKhamKhamBenhId(id) {
  return axios.get(`${API.QL_DANGKYKHAM_ID.format(id)}/henkham`, {
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

export function getChanDoanHinhAnhImage(benhan_id, ){
  return axios
    .get(`${API.CHANDOAN_HINHANH_IMAGE.format(benhan_id)}`)
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
