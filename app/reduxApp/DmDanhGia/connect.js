import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchDmDanhGia } from "./actions";
import { selectDmDanhGia } from "./selectors";

export function useDmDanhGia() {
  useInjectReducer({ key: "dmdanhgia", reducer });
  useInjectSaga({ key: "dmdanhgia", saga });

  const dmdanhgia = useSelector(selectDmDanhGia);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!dmdanhgia || !dmdanhgia.length) {
      dispatch(fetchDmDanhGia());
    }
  }, []);
  return { dmdanhgia };
}

export function withDmDanhGia(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { dmdanhgia } = useDmDanhGia();
    
    return (
      <WrappedComponent
        {...props}
        dmdanhgia={dmdanhgia}
      />
    );
  };
}
