export interface ListState<T> {
  loading: boolean;
  infos: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    pageSizeOptions: string[];
    showSizeChanger: boolean;
    showQuickJumper: boolean;
  };
  fieldsValue: any;
}

export interface MakeHandleActionsResult {
  [name: string]: (state, action) => any;
}

function makeHandleActions(listActionName, apiPath?): MakeHandleActionsResult {
  return {
    [listActionName.request](state, action) {
      const { token, operatorId, pageNo, pageSize, ...queryData } = action.payload;
      if (apiPath) {
        return {
          ...state,
          [apiPath]: {
            ...state[apiPath],
            loading: true,
            fieldsValue: queryData,
          },
        };
      } else {
        return {
          ...state,
          loading: true,
          fieldsValue: queryData,
        };
      }
    },
    [listActionName.success](state, action) {
      if (apiPath) {
        return {
          ...state,
          [apiPath]: {
            ...state[apiPath],
            loading: false,
            infos: action.payload.res.infos,
            pagination: {
              ...state[apiPath].pagination,
              current: action.payload.req.pageNo || 1,
              pageSize: action.payload.req.pageSize || 10,
              total: action.payload.res.totalNum,
            },
          },
        };
      } else {
        return {
          ...state,
          loading: false,
          infos: action.payload.res.infos,
          pagination: {
            ...state.pagination,
            current: action.payload.req.pageNo || 1,
            pageSize: action.payload.req.pageSize || 10,
            total: action.payload.res.totalNum,
          },
        };
      }
    },
    [listActionName.error](state, action) {
      if (apiPath) {
        return {
          ...state,
          [apiPath]: {
            ...state[apiPath],
            loading: false,
            infos: [],
          },
        };
      } else {
        return {
          ...state,
          loading: false,
          infos: [],
        };
      }
    },
  };
}

export function getInitializeState<T>(): ListState<T> {
  return {
    loading: false,
    infos: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
      showSizeChanger: true,
      showQuickJumper: true,
    },
    fieldsValue: {},
  };
}

export function makeListHandleActions<T>(listActionName: any): {
  handleActions: MakeHandleActionsResult,
  initializeState: ListState<T>;
};
export function makeListHandleActions<I>(listActionName: any, apiPath: string): {
  handleActions: MakeHandleActionsResult,
  initializeState: any;
};
export function makeListHandleActions<T = any>(listActionName, apiPath?: string) {
  let handleActions = makeHandleActions(listActionName, apiPath);
  if (apiPath) {
    let initializeState = {
      [apiPath]: getInitializeState<T>(),
    };
    return {
      handleActions: handleActions,
      initializeState: initializeState,
    };
  } else {
    let initializeState = getInitializeState<T>();
    return {
      handleActions: handleActions,
      initializeState: initializeState,
    };
  }
}
