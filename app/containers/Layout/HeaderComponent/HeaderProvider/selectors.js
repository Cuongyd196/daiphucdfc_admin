import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectStateDashBoard = state => state.HeaderComponent || initialState;

const makeGetMyInfo = () =>
  createSelector(selectStateDashBoard, appState => appState.get('myInfo'));


const selectState = state => state.permission || {};

const makeGetPermission = () =>
  createSelector(selectState, appState => appState);

export { makeGetMyInfo, makeGetPermission };
