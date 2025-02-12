import { LOADING } from './constants';

export function toggleLoading(loading) {
  return {
    type: LOADING,
    loading,
  };
}

