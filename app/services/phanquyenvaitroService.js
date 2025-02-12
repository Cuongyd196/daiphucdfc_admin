import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  query = query ? query : '';
  return axios.get(`${API.PHAN_QUYEN_VAI_TRO_QUERY.format(page, limit, query)}`).then(res => {
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

export function getById(id, query) {
  query = query ? query : '';
  return axios.get(`${API.PHAN_QUYEN_VAI_TRO_ID_QUERY.format(id, query)}`).then(res => {
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

export function updateById(id, data) {
  return axios
    .put(`${API.PHAN_QUYEN_VAI_TRO_ID.format(id)}`, data)
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

export function add(data) {
  return axios
    .post(`${API.PHAN_QUYEN_VAI_TRO}`, data)
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

export function deleteById(id) {
  return axios
    .delete(`${API.PHAN_QUYEN_VAI_TRO_ID.format(id)}`)
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

export function addTrang(id, data) {
  return axios.post(`${API.VAI_TRO_TRANG.format(id)}`, data).then(res => {
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


export function putTrang(id, idTrang, data) {
  return axios.put(`${API.VAI_TRO_TRANG_ID.format(id, idTrang)}`, data).then(res => {
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

// export function deleteTrang(id, idTrang) {
//   return axios.delete(`${API.VAI_TRO_TRANG_ID.format(id, idTrang)}`).then(res => {
//     if (res.data) {
//       return res.data;
//     }
//     else {
//       return null
//     }
//   })
//     .catch(error => {
//       return null
//     });
// }
