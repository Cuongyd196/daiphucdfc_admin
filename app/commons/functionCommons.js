import { API } from '@api';

export function convertParam(queryObj, firstCharacter = '?') {
  if (typeof queryObj !== 'object') return '';
  let query = '';
  Object.entries(queryObj).forEach(([key, value]) => {
    if (value || value === 0 || value === '0') {
      query += query
        ? '&'
        : firstCharacter || '';
      query += `${key}=${value}`;
    }
  });
  return query;
}

export function convertFileName(str) {
  if (!str) return '';

  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E');
  str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
  str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U');
  str = str.replace(/[ỲÝỴỶỸ]/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/\s+/g, ' ');
  str.trim();
  return str;
}

export function getPermissionByUser(role, permission) {
  const permissionUser = {}

  return permissionUser
}

export const convertUrlToListFile = (list) => {
  let arr = list.map((data, idx) => {
    return {
      uid: idx,
      name: data,
      status: 'done',
      url: API.FILES.format(data),
    }
  })
  return arr
}

export const getfileDetail = (listFile) => {
  let originFileNm = []
  let fileUpload = []
  listFile.filter(data => {
    if(data.url){
      originFileNm = [...originFileNm, data.name]
    }else{
      fileUpload = [...fileUpload, data.originFileObj]
    }
  })
  return [originFileNm, fileUpload]
}

export const getPreviewImage = (fileNameList) => {
  let data = []
  if (Array.isArray(fileNameList)) {
    data = fileNameList.map((data, idx) => {
      return {
        uid: idx,
        name: data,
        status: 'done',
        url: API.FILES.format(data),
      };
    });
  }
  return data
};

export const getPreviewFile = (fileNameList) => {
  let data = []
  if (Array.isArray(fileNameList)) {
    data = fileNameList.map((data, idx) => {
      return {
        uid: idx,
        name: data,
        status: 'done',
        url: API.LIST_FILES.format(data),
      };
    });
  }
  return data
};
