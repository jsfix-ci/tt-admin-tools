import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore, { sagaMiddleware, PersistConfig } from './store';
import { PersistGate } from 'redux-persist/es/integration/react';

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
  private _router: any;

  constructor(options: TTAppOptions) {
    const { persistor, store } = configureStore({}, options.persistConfig, options.model.reducers);
    this._store = store;
    this._persistor = persistor;
    sagaMiddleware.run(options.model.appSaga);
  }

  router(router: any) {
    this._router = router;
  }

  start(containerId: string) {
    let render = () => {
      const RouterConfig = this._router;
      ReactDOM.render(
        <Provider store={this._store}>
          <PersistGate persistor={this._persistor}>
            {RouterConfig()}
          </PersistGate>
        </Provider>,
        document.getElementById(containerId),
      );
    };
  
    render();
  }
}
