import { makeListHandleActions, getInitializeState } from '../listReducers';
import { initApi } from '../initApi';
import { handleActions, createAction } from 'redux-actions';

let apis = {
  login: 'login',
};

let apiConfigs = [{
  path: '/system/login',
  actionName: apis.login,
}];

const testApis = initApi<typeof apis>('/api', apiConfigs, 'test');

function createReducer(apis, apiPath = undefined) {
  const listHandle = makeListHandleActions(apis.apiActionNames.login, apiPath);
  const reducer = handleActions({
    ...listHandle.handleActions,
  }, {
    ...listHandle.initializeState,
  });
  return reducer;
}

describe('listReducers', () => {
  it('handle list action correctly', () => {
    const reducer = createReducer(testApis);
    const initialState = getInitializeState();

    expect(reducer(undefined, {} as any)).toEqual(initialState);

    expect(reducer(undefined, testApis.apiActions.login({}))).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.success)({
      req: {
        pageNo: 1,
        pageSize: 10,
      },
      res: {
        pageMax: 1,
        totalNum: 1,
        infos: [{
          name: 'mary',
          age: 25,
        }],
      }
    }))).toEqual({
      ...initialState,
      infos: [{
        name: 'mary',
        age: 25,
      }],
      pagination: {
        ...initialState.pagination,
        total: 1,
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.error)({}))).toEqual(
      {
        ...initialState,
      }
    );
  });

  it('handle apiPath list action correctly', () => {
    const reducer = createReducer(testApis, 'login');
    const initialState = getInitializeState();

    expect(reducer(undefined, {} as any)).toEqual({
      login: initialState,
    });

    expect(reducer(undefined, testApis.apiActions.login({}))).toEqual({
      login: {
        ...initialState,
        loading: true,
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.success)({
      req: {
        pageNo: 1,
        pageSize: 10,
      },
      res: {
        pageMax: 1,
        totalNum: 1,
        infos: [{
          name: 'mary',
          age: 25,
        }],
      }
    }))).toEqual({
      login: {
        ...initialState,
        infos: [{
          name: 'mary',
          age: 25,
        }],
        pagination: {
          ...initialState.pagination,
          total: 1,
        },
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.error)({}))).toEqual(
      {
        login: { ...initialState },
      }
    );
  });
});