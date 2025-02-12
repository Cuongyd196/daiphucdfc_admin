import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
  return axios.get(`${API.QL_BENHNHAN_QUERY.format(page, limit, query)}`).then(res => {
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
  return axios.post(`${API.QL_BENHNHAN}`, data).then(res => {
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
  return axios.get(`${API.QL_BENHNHAN_ID.format(id)}`).then(res => {
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

export function getLinkSuKham(id) {
  return axios.get(`${API.QL_BENHNHAN_HISTORY.format(id)}`).then(res => {
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

export function getLichHenKham(id) {
  return axios.get(`${API.QL_BENHNHAN_HENKHAM.format(id)}`).then(res => {
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
  return axios.delete(`${API.QL_BENHNHAN_ID.format(id)}`).then(res => {
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
  return axios.put(`${API.QL_BENHNHAN_ID.format(id)}`, data).then(res => {
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

export  function getChiTietDonThuocId(id) {
  return axios.get(`${API.QL_BENHNHAN_ID.format(id)}/donthuoc`, {
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

export  function getKetQuaCLSId(id) {
  return axios.get(`${API.QL_BENHNHAN_ID.format(id)}/ketquacls`, {
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

export  function getKetQuaCLSById(id) {
  return axios.get(`${API.KETQUACLS_ID.format(id)}`, {
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

export function getLinkSuThuoc(id) {
  return axios.get(`${API.QL_BENHNHAN_HISTORY_DONTHUOC.format(id)}`).then(res => {
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

export function dongbobenhnhanHis(id, data) {
  return axios.put(`${API.QL_BENHNHAN_ID.format(id)}/dong-bo`, data).then(res => {
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

export function getCdha(id, stt) {
  return axios
    .get(`${API.GET_CDHA.format(id, stt)}`)
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