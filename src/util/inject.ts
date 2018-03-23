import * as React from 'react';
import { connect } from 'react-redux';

export interface PropStates {
  [key: string]: string;
}

export interface SNormalComponentProps<TokenState> {
  dispatch: any;
  token: TokenState;
}

export interface InjectConfig {
  getToken: (state: any) => any;
}

export default function createInject(config: InjectConfig) {
  return function injectNormal<OwnProps = any>(MyComponent, propState?: PropStates) {
    const mapState2Props = state => {
      let props = {
        token: config.getToken(state),
      };
      if (propState) {
        Object.keys(propState).forEach(propsName => {
          props = {
            ...props,
            ...{
              [propsName]: state[propState[propsName]],
            },
          };
        });
      }
      return props;
    };
  
    return connect(mapState2Props, null, null, { withRef: true })(MyComponent) as React.ComponentClass<OwnProps>;
  }
}
