import { createAction } from 'redux-actions';

const loginTimeout = createAction<any>('loginTimeout') as any;
const updatePane = createAction<any>('updatePane') as any;

export default {
  loginTimeout,
  updatePane,
};
