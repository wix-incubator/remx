import isFunction from 'lodash.isfunction';
import React from 'react';
import { observer } from './observer';
import * as Logger from './logger';
import hoistNonReactStatics from 'hoist-non-react-statics';

const connect = (mapStateToProps) => {
  if (isFunction(mapStateToProps)) {
    return wrapWithObserverHigherOrderComponent(mapStateToProps);
  }
  return observer;
};

function wrapWithObserverHigherOrderComponent(mapStateToProps) {
  return (Comp) => {
    const wrappedComponent = observerOnMapStateToProps(Comp, mapStateToProps);
    mergeStaticMembers(Comp, wrappedComponent);
    return wrappedComponent;
  };
}

function observerOnMapStateToProps(InnerComp, mapStateToProps) {
  return observer((props) => {
    Logger.startLoggingMapStateToProps();
    const propsFromState = mapStateToProps(props);
    Logger.endLoggingMapStateToProps(InnerComp.name, propsFromState);
    return (
      <InnerComp {...props} {...propsFromState} />
    );
  });
}

function mergeStaticMembers(SrcComp, DestComp) {
  hoistNonReactStatics(DestComp, SrcComp);
}

module.exports = {
  connect
};
