import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore, { sagaMiddleware, PersistConfig } from './store';
import { PersistGate } from 'redux-persist/es/integration/react';
import router, { NavData } from './router';

export interface TTAppOptions {
  persistConfig?: PersistConfig;
  model: {
    reducers: any;
    appSaga: any;
  };
}

export default class TTApp {
  private _store: any;
  private _persistor: any;
  private _nav: NavData[];

  constructor(options: TTAppOptions) {
    const { persistor, store } = configureStore({}, options.persistConfig, options.model.reducers);
    this._store = store;
    this._persistor = persistor;
    sagaMiddleware.run(options.model.appSaga);
  }

  router(nav: NavData[]) {
    this._nav = nav;
  }

  start(containerId: string) {
    let render = () => {
      ReactDOM.render(
        <Provider store={this._store}>
          <PersistGate persistor={this._persistor}>
            {router(this._nav)}
          </PersistGate>
        </Provider>,
        document.getElementById(containerId),
      );
    };
  
    render();
  }
}
