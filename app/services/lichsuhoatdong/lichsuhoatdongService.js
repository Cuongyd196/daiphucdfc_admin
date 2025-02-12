import axios from "axios";
import { API } from "@api";

export function getAll(page, limit, query) {
    query = query ? query : "";
    return axios
      .get(`${API.LICH_SU_HOAT_DONG_QUERY.format(page, limit, query)}`)
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