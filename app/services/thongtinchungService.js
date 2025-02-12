import axios from 'axios';
import { API } from '@api';

export function add(data) {
  return axios.post(`${API.THONG_TIN_CHUNG}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  }).catch(error => {
    return null;
  });
}

export function getOne(query) {
  query = query ? query : '';
  return axios.get(`${API.THONG_TIN_CHUNG_QUERY.format(query)}`).then(res => {
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

export function update(id, data) {
  delete data._id;
  return axios.put(`${API.THONG_TIN_CHUNG_ID.format(id)}`, data).then(res => {
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

export function getOneFE(query) {
  query = query ? query : '';
  return axios.get(`${API.QUAN_LY_FRONTEND.format(query)}`).then(res => {
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

export function updateFE(id, data) {
  delete data._id;
  return axios.put(`${API.QUAN_LY_FRONTEND_ID.format(id)}`, data).then(res => {
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

export function addFE(data) {
  return axios.post(`${API.QUAN_LY_FRONTEND}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  }).catch(error => {
    return null;
  });
}

export function addSlide(id, data) {
  return axios.post(`${API.FE_SLIDE.format(id)}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  }).catch(error => {
    return null;
  });
}

export function putSlide(id, idSlide, data) {
  return axios.put(`${API.FE_SLIDE_ID.format(id, idSlide)}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  }).catch(error => {
    return null;
  });
}

export function delSlide(id, idSlide) {
  return axios.delete(`${API.FE_SLIDE_ID.format(id, idSlide)}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  }).catch(error => {
    return null;
  });
}

export function getAllLienHe(page, limit, query) {
  query = query ? query : "";
  return axios
    .get(`${API.QL_LIEN_HE_QUERY.format(page, limit, query)}`)
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

export function updateLienHeById(id, data) {
  return axios
    .put(`${API.QL_LIEN_HE_ID.format(id)}`, data)
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
