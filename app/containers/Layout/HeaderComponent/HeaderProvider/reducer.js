import { fromJS } from 'immutable';
import { message } from 'antd';

import {
  GET_MY_INFO,
  GET_MY_INFO_SUCCESS,
  GET_MY_INFO_ERROR,
  UPDATE_MY_INFO,
  UPDATE_MY_INFO_SUCCESS,
  UPDATE_MY_INFO_ERROR,
  GET_PERMISSION_ERROR,
  GET_PERMISSION_SUCCESS,
} from './constants';

export const initialState = fromJS({
  myInfo: {},
});

function getDeviceReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MY_INFO:
      return state;
    case GET_MY_INFO_SUCCESS:
      return state
        .set('myInfo', action.dataRes);
    case GET_MY_INFO_ERROR:
      return state;
    /*--------------------------------------------------------*/
    case UPDATE_MY_INFO:
      return state;
    case UPDATE_MY_INFO_SUCCESS:
      message.success('Cập nhật Thông tin cá nhân thành công');
      return state
        .set('myInfo', action.dataRes);
    case UPDATE_MY_INFO_ERROR:
      message.error((action && action.error) ? action.error : 'Có lỗi trong quá trình cập nhật, vui lòng thử lại');
      return state;
    /*--------------------------------------------------------*/
    default:
      return state;
  }
}

function getPermissionReducer (state = {}, action) {
  switch (action.type) {
    case GET_PERMISSION_SUCCESS:
      return action.data
    case GET_PERMISSION_ERROR:
      return state;
    default:
      return state;
  }
}

export {getPermissionReducer};

export default getDeviceReducer;
