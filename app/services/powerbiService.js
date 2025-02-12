import axios from 'axios';
import { API } from '@api';

function getToken() {
  return axios.get(`${API.POWERBI}`).then(res => {
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

export {getToken}
