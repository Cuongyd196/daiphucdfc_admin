import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
    query = query ? query : ''
    return axios.get(`${API.GOI_DICH_VU_QUERY.format(page, limit, query)}`).then(res => {
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

export function getById(id, query) {
    query = query ? query : ''
    return axios.get(`${API.GOI_DICH_VU_ID_QUERY.format(id, query)}`).then(res => {
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
      .put(`${API.GOI_DICH_VU_ID.format(id)}`, data)
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
      .post(`${API.GOI_DICH_VU}`, data)
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
    .delete(`${API.GOI_DICH_VU_ID.format(id)}`)
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
      
export function addDichVu(id, data) {
  return axios.post(`${API.DS_DICHVU.format(id)}`, data).then(res => {
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


export function putDichVu(id, idDichVu , data) {
  return axios.put(`${API.DS_DICHVU_ID.format(id, idDichVu)}`, data).then(res => {
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

export function deleteDichVu(id, idDichVu) {
  return axios.delete(`${API.DS_DICHVU_ID.format(id, idDichVu)}`).then(res => {
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