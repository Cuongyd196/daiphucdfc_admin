import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchDMGia } from "./actions";
import { selectDMGia } from "./selectors";

export function useDanhMucGia() {
  useInjectReducer({ key: "danhmucgia", reducer });
  useInjectSaga({ key: "danhmucgia", saga });

  const dmgia = useSelector(selectDMGia);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!dmgia || !dmgia.length) {
      dispatch(fetchDMGia());
    }
  }, []);
  return { dmgia };
}

export function withDanhMucGia(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { dmgia } = useDanhMucGia();
    
    return (
      <WrappedComponent
        {...props}
        dmgia={dmgia}
      />
    );
  };
}
