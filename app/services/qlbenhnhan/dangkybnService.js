import axios from 'axios';
import { API } from '@api';

export function saveData(data) {
  return axios.post(`${API.DANGKY_BENHNHAN}`, data).then(res => {
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
