import axios from 'axios';
import { API } from '@api';

export function login(data) {
  return axios.post(API.LOGIN, data)
    .then(response => {
      if (response.status === 200 && response.data && response.data.token) return response.data.token;
      return null;
    })
    .catch(() => null);
}
