import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchNhanVien } from "./actions";
import { selectNhanVien } from "./selectors";

export function useNhanVien() {
  useInjectReducer({ key: "nhanvien", reducer });
  useInjectSaga({ key: "nhanvien", saga });

  const nhanvien = useSelector(selectNhanVien);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!nhanvien || !nhanvien.length) {
      dispatch(fetchNhanVien());
    }
  }, []);

  return { nhanvien };
}

export function withNhanVien(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { nhanvien } = useNhanVien();
    
    return (
      <WrappedComponent
        {...props}
        nhanvien={nhanvien}
      />
    );
  };
}
