/*
 *
 * Toggle Sider reducer
 *
 */

import produce from 'immer';
export const initialState = {
  toggleSider: false,
};

const toggleSiderReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'TOGGLE_SIDER':
        draft.toggleSider = action.toggleSider;
        break;
    }
  });

export default toggleSiderReducer;
