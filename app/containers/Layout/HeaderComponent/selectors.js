import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the language domain
 */

const selectToggleSider = state => state.toggleSider || initialState;

const makeSelectToggleSider = () =>
  createSelector(
    selectToggleSider,
    toggleSiderState => toggleSiderState.toggleSider
  );

export { selectToggleSider, makeSelectToggleSider };
