import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchDmHuongDan} from "./actions";
import { selectDmHuongDan } from "./selectors";

export function useDmHuongDan() {
  useInjectReducer({ key: "dmhuongdan", reducer });
  useInjectSaga({ key: "dmhuongdan", saga });

  const dmhuongdan = useSelector(selectDmHuongDan);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!dmhuongdan || !dmhuongdan.length) {
      dispatch(fetchDmHuongDan());
    }
  }, []);

  return { dmhuongdan };
}

export function withDmHuongDan(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { dmhuongdan } = useDmHuongDan();
    
    return (
      <WrappedComponent
        {...props}
        dmhuongdan={dmhuongdan}
      />
    );
  };
}
