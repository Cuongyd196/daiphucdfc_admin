import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchLoaiDV, fetchNhomThuoc, fetchDVT, fetchHoatChat, fetchDuongDung, fetchDV } from "./actions";
import { selectDV, selectDVT, selectHoatChat, selectLoaiDV, selectNhomThuoc, selectDuongDung } from "./selectors";

export function useThuoc() {
  useInjectReducer({ key: "thuoc", reducer });
  useInjectSaga({ key: "thuoc", saga });

  const loaidv = useSelector(selectLoaiDV);
  const nhomthuoc = useSelector(selectNhomThuoc);
  const hoatchat = useSelector(selectHoatChat);
  const dvt = useSelector(selectDVT);
  const dv = useSelector(selectDV);
  const duongdung = useSelector(selectDuongDung);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!loaidv || !loaidv.length) {
      dispatch(fetchLoaiDV());
    }
  }, []);

  React.useEffect(() => {
    if (!nhomthuoc || !nhomthuoc.length) {
      dispatch(fetchNhomThuoc());
    }
  }, []);

  React.useEffect(() => {
    if (!hoatchat || !hoatchat.length) {
      dispatch(fetchHoatChat());
    }
  }, []);

  React.useEffect(() => {
    if (!dvt || !dvt.length) {
      dispatch(fetchDVT());
    }
  }, []);

  React.useEffect(() => {
    if (!dv || !dv.length) {
      dispatch(fetchDV());
    }
  }, []);

  React.useEffect(() => {
    if (!duongdung || !duongdung.length) {
      dispatch(fetchDuongDung());
    }
  }, []);

  return { loaidv, nhomthuoc, hoatchat, dvt, duongdung, dv };
}

export function withThuoc(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { loaidv, nhomthuoc, hoatchat, dvt, duongdung, dv } = useThuoc();
    
    return (
      <WrappedComponent
        {...props}
        loaidv={loaidv}
        nhomthuoc={nhomthuoc}
        hoatchat={hoatchat}
        dvt={dvt}
        dv={dv}
        duongdung={duongdung}
      />
    );
  };
}
