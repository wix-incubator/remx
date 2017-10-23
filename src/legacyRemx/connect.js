import { isFunction } from 'lodash';
import React from 'react';
import { observable, action } from 'mobx';
import { observer } from '../mobxReactClone'; // should import from mobx-react/custom when they fix issue #319
import * as Logger from './logger';

const globalObservableKey = observable({ key: 1 });

export const triggerStateUpdate = action(() => {
  globalObservableKey.key++;
});

export const touchGlobalKey = () => {
  (() => globalObservableKey.key)();
};

export const connect = (mapStateToProps) => {
  return (Comp) => {
    const connectedComponent = createConnectedComponent(Comp, mapStateToProps);
    copyStaticMembers(connectedComponent, Comp);
    return connectedComponent;
  };
};
const createConnectedComponent = (Comp, mapStateToProps) => {
  const getMappedProps = (ownProps) => {
    if (isFunction(mapStateToProps)) {
      Logger.startBuffering();
      const propsFromState = mapStateToProps(ownProps);
      const triggeredEvents = Logger.endBuffring();
      Logger.log({ action: Logger.actions.MAP_STATE_TO_PROPS, connectedComponentName: Comp.name, returnValue: propsFromState, triggeredEvents });
      return propsFromState;
    }
    return {};
  };

  class Hoc extends React.Component {
    constructor(props) {
      super(props);
      // set the component name for the logger:
      this.originalComponentName = Comp.name;
    }

    render() {
      return (
        <Comp
          {...this.props}
          {...getMappedProps(this.props)}
          globalObservableKey={globalObservableKey.key}
        />);
    }
  }

  return observer(Hoc);
};

const copyStaticMembers = (target, src) => {
  Object.keys(src).forEach((key) => {
    target[key] = src[key];
  });
};

