import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchLoaiKhoa, fetchKhoa, fetchSPhong } from "./actions";
import { selectLoaiKhoa, selectKhoa, selectSPhong } from "./selectors";

export function usePhong() {
  useInjectReducer({ key: "phong", reducer });
  useInjectSaga({ key: "phong", saga });

  const loaikhoa = useSelector(selectLoaiKhoa);
  const khoa = useSelector(selectKhoa);
  const sphong = useSelector(selectSPhong);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!loaikhoa || !loaikhoa.length) {
      dispatch(fetchLoaiKhoa());
    }
  }, []);

  React.useEffect(() => {
    if (!khoa || !khoa.length) {
      dispatch(fetchKhoa());
    }
  }, []);

  React.useEffect(() => {
    if (!sphong || !sphong.length) {
      dispatch(fetchSPhong());
    }
  }, []);

  return { loaikhoa, khoa, sphong };
}

export function withPhong(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { loaikhoa, khoa, sphong } = usePhong();
    
    return (
      <WrappedComponent
        {...props}
        loaikhoa={loaikhoa}
        khoa={khoa}
        sphong={sphong}
      />
    );
  };
}
