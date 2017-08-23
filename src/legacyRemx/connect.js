import { isFunction } from 'lodash';
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

globalObservableKey = observable({ key: 1 });

export const triggerStateUpdate = action(() => {
  globalObservableKey.key = globalObservableKey.key + 1;
});

export const touchGlobalKey = () => {
  const touchGlobalKeyToTriggerMobx = globalObservableKey.key;
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
      return mapStateToProps(ownProps);
    } else {
      return {};
    }
  };
  return observer((props) => {
    return (
      <Comp
        {...props}
        {...getMappedProps(props)}
        globalObservableKey={globalObservableKey.key}
      />);
  });
};

const copyStaticMembers = (target, src) => {
  Object.keys(src).forEach((key) => {
    target[key] = src[key];
  });
};

