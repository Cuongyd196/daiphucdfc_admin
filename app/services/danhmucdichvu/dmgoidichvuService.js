import axios from 'axios';
import { API } from '@api';

export function getAll(page, limit, query) {
    query = query ? query : ''
    return axios.get(`${API.DMGOIDICHVU_QUERY.format(page, limit, query)}`).then(res => {
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
    return axios.get(`${API.DMGOIDICHVU_ID.format(id)}`).then(res => {
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
    .put(`${API.DMGOIDICHVU_ID.format(id)}`, data)
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
    .post(`${API.DMGOIDICHVU}`, data)
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
    .delete(`${API.DMGOIDICHVU_ID.format(id)}`)
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
