import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchQuanHuyen } from "./actions";
import { selectQuanHuyen  } from "./selectors";

export function useQuanHuyen() {
  useInjectReducer({ key: "quanhuyen", reducer });
  useInjectSaga({ key: "quanhuyen", saga });

  const quanhuyen = useSelector(selectQuanHuyen);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!quanhuyen || !quanhuyen.length) {
      dispatch(fetchQuanHuyen());
    }
  }, []);

  return { quanhuyen };
}

export function withQuanHuyen(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { quanhuyen} = useQuanHuyen();
    
    return (
      <WrappedComponent
        {...props}
        quanhuyen={quanhuyen}
      />
    );
  };
}
