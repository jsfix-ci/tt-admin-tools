import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistCombineReducers, persistStore, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
export const sagaMiddleware = createSagaMiddleware() as any;
import { addTokenMiddleware } from '../model/initApi';

let defaultTransform = createTransform<any, any>(
  (state, key) => {
    if (key === 'menu') {
      return {
        menus: [],
        exception: null,
        paneConfigs: state.paneConfigs.map(item => {
          return {
            ...item,
            componentName: item.originComponentName,
            options: null,
          };
        }),
        name: state.name,
      };
    }
  },
  (state, key) => {
    if (key === 'menu') {
      return {
        ...state,
        menus: [],
        exception: null,
      };
    }
  },
  { whitelist: ['menu'] },
);

export interface PersistConfig {
  key?: string;
  whiteList?: any[];
  transforms?: any[];
}

declare const window: any;
export default function configureStore(initialState = {}, customPersistConfig: PersistConfig, reducers: any) {
  if (!customPersistConfig) {
      customPersistConfig = {} as any;
  }
  const persistConfig = {
    key: customPersistConfig.key || 'admin',
    storage,
    whitelist: customPersistConfig.whiteList || [
      'token',
      'menu',
    ],
    transforms: customPersistConfig.transforms || [defaultTransform],
  };
  
  const reducer = persistCombineReducers(persistConfig, reducers);

  const enhancer = compose(
    applyMiddleware(addTokenMiddleware),
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  );

  const store = createStore(reducer, initialState, enhancer as any) as any;
  let persistor = persistStore(store) as any;

  return { persistor, store };
}
