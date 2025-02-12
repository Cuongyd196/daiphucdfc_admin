import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectStateApp = state => state.App || initialState;

const makeGetLoading = () =>
  createSelector(selectStateApp, appState => appState.get('loading'));

export { makeGetLoading };
