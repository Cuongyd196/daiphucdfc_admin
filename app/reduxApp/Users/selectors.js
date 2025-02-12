import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectUsers = state => state.user || initialState;

export const selectUser = createSelector(
  [selectUsers],
  userState => userState.user
);


