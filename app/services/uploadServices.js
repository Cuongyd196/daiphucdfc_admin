import axios from 'axios';

function uploadFiles(files) {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };
  let path = '/api/files/files';
  let dataRes = [];
  const uploaders = files.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append('image', file);

    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if (data && data.file_id) {
        dataRes = [...dataRes, data.file_id];
      }

    }).catch(error => {
      console.log(error, 'upload k thành công');
    });
  });

  return axios.all(uploaders).then(axios.spread(function(res1, res2) {
    return dataRes;
  }));
}

function uploadImages(images) {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };
  let path = '/api/files';
  let dataRes = [];
  const uploaders = images.map((file, index) => {
    // Initial FormData
    const formData = new FormData();
    formData.append('image', file);
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post(path, formData, config).then(response => {
      const data = response.data;
      if (data) {
        dataRes = [...dataRes, data.image_id];
      }
    }).catch(error => {
      console.log(error, 'upload k thành công');
    });
  });

  return axios.all(uploaders).then(axios.spread(function(res1, res2) {
    return dataRes;
  }));
}

async function uploadImage(image) {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };
  let path = '/api/files';
  let image_id = '';
  const formData = new FormData();
  formData.append('image', image);
  let dataRes = await axios.post(path, formData, config);
  if (dataRes) {
    let data = dataRes.data;
    image_id = data.image_id;
  }
  return image_id;
}

export const getfileDetail = (listFile) => {
  let originFileNm = [];
  let fileUpload = [];
  listFile.filter(data => {
    if (data.url) {
      originFileNm = [...originFileNm, data.url];
    } else {
      fileUpload = [...fileUpload, data.originFileObj];
    }
  });
  return [originFileNm, fileUpload];
};

export {
  uploadFiles,
  uploadImages,
  uploadImage,
};
