import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useInjectSaga } from "@utils/injectSaga";
import { useInjectReducer } from "@utils/injectReducer";

import saga from "./saga";
import reducer from "./reducer";

import { fetchUser } from "./actions";
import { selectUser } from "./selectors";

export function useUser() {
  useInjectReducer({ key: "user", reducer });
  useInjectSaga({ key: "user", saga });

  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!user || !user.length) {
      dispatch(fetchUser());
    }
  }, []);

  return { user };
}

export function withUser(WrappedComponent) {
  // eslint-disable-next-line func-names
  return function(props) {
    const { user } = useUser();
    
    return (
      <WrappedComponent
        {...props}
        user={user}
      />
    );
  };
}
