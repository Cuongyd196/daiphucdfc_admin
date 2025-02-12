import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchPhai} from "./actions";
import { selectPhai } from "./selectors";

export function usePhai() {
  useInjectReducer({ key: "phai", reducer });
  useInjectSaga({ key: "phai", saga });

  const phai = useSelector(selectPhai);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!phai || !phai.length) {
      dispatch(fetchPhai());
    }
  }, []);

  return { phai };
}

export function withPhai(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { phai } = usePhai();
    
    return (
      <WrappedComponent
        {...props}
        phai={phai}
      />
    );
  };
}
