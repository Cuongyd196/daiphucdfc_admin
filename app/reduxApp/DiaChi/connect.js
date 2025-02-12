import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchQuanHuyen, fetchTinhThanh, fetchPhuongXa } from "./actions";
import { selectQuanHuyen, selectTinhThanh, selectPhuongXa  } from "./selectors";

export function useDiaChi() {
  useInjectReducer({ key: "diachi", reducer });
  useInjectSaga({ key: "diachi", saga });

  const quanhuyen = useSelector(selectQuanHuyen);
  const tinhthanh = useSelector(selectTinhThanh);
  const phuongxa = useSelector(selectPhuongXa);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!quanhuyen || !quanhuyen.length) {
      dispatch(fetchQuanHuyen());
    }
  }, []);

  React.useEffect(() => {
    if (!tinhthanh || !tinhthanh.length) {
      dispatch(fetchTinhThanh());
    }
  }, []);

  React.useEffect(() => {
    if (!phuongxa || !phuongxa.length) {
      dispatch(fetchPhuongXa());
    }
  }, []);

  return { quanhuyen,tinhthanh, phuongxa };
}

export function withDiaChi(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { quanhuyen,tinhthanh, phuongxa} = useDiaChi();
    
    return (
      <WrappedComponent
        {...props}
        quanhuyen={quanhuyen}
        tinhthanh={tinhthanh}
        phuongxa={phuongxa}
      />
    );
  };
}
