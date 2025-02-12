import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchTinhThanh } from "./actions";
import { selectTinhThanh } from "./selectors";

export function useTinhThanh() {
  useInjectReducer({ key: "tinhthanh", reducer });
  useInjectSaga({ key: "tinhthanh", saga });

  const tinhthanh = useSelector(selectTinhThanh);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!tinhthanh || !tinhthanh.length) {
      dispatch(fetchTinhThanh());
    }
  }, []);

  return { tinhthanh };
}

export function withTinhThanh(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { tinhthanh } = useTinhThanh();
    
    return (
      <WrappedComponent
        {...props}
        tinhthanh={tinhthanh}
      />
    );
  };
}
