import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchPhai, fetchDanToc, fetchQuocTich, fetchNgheNghiep, fetchNhanVien } from "./actions";
import { selectPhai, selectDanToc, selectQuocTich, selectNgheNghiep, selectNhanVien } from "./selectors";

export function useGioiTinh() {
  useInjectReducer({ key: "gioitinh", reducer });
  useInjectSaga({ key: "gioitinh", saga });

  const phai = useSelector(selectPhai);
  const dantoc = useSelector(selectDanToc);
  const quoctich = useSelector(selectQuocTich);
  const nghenghiep = useSelector(selectNgheNghiep);
  const nhanvien = useSelector(selectNhanVien);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!phai || !phai.length) {
      dispatch(fetchPhai());
    }
  }, []);

  React.useEffect(() => {
    if (!dantoc || !dantoc.length) {
      dispatch(fetchDanToc());
    }
  }, []);

  React.useEffect(() => {
    if (!quoctich || !quoctich.length) {
      dispatch(fetchQuocTich());
    }
  }, []);

  React.useEffect(() => {
    if (!nghenghiep || !nghenghiep.length) {
      dispatch(fetchNgheNghiep());
    }
  }, []);

  React.useEffect(() => {
    if (!nhanvien || !nhanvien.length) {
      dispatch(fetchNhanVien());
    }
  }, []);

  return { phai, dantoc, quoctich, nghenghiep, nhanvien };
}

export function withGioiTinh(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { phai, dantoc, quoctich, nghenghiep, nhanvien } = useGioiTinh();
    
    return (
      <WrappedComponent
        {...props}
        phai={phai}
        dantoc={dantoc}
        quoctich={quoctich}
        nghenghiep={nghenghiep}
        nhanvien={nhanvien}
      />
    );
  };
}
