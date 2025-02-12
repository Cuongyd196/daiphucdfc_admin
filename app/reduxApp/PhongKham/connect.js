import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchPhong } from "./actions";
import { selectPhong } from "./selectors";

export function usePhong() {
  useInjectReducer({ key: "phong", reducer });
  useInjectSaga({ key: "phong", saga });

  const phong = useSelector(selectPhong);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!phong || !phong.length) {
      dispatch(fetchPhong());
    }
  }, []);

  return { phong };
}

export function withPhong(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { phong } = usePhong();
    
    return (
      <WrappedComponent
        {...props}
        phong={phong}
      />
    );
  };
}
