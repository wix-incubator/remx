import * as _ from 'lodash';
import React from 'react';
import { observer } from '../mobxReactClone'; // should import from mobx-react/custom when they fix issue #319
import * as Logger from './logger';
import hoistNonReactStatics from 'hoist-non-react-statics';

const connect = (mapStateToProps) => {
  if (_.isFunction(mapStateToProps)) {
    return wrapWithObserverHigherOrderComponent(mapStateToProps);
  }
  return observer;
};

function wrapWithObserverHigherOrderComponent(mapStateToProps) {
  return (Comp) => {
    const wrappedComponent = observerOnMapStateToProps(Comp, mapStateToProps);
    mergeStaticMembers(Comp, wrappedComponent);
    injectPrototype(Comp, wrappedComponent);
    return wrappedComponent;
  };
}

function observerOnMapStateToProps(InnerComp, mapStateToProps) {
  class Hoc extends React.Component {
    constructor(props) {
      super(props);
      // set the component name for the logger:
      this.originalComponentName = InnerComp.name;
    }

    render() {
      Logger.startLoggingMapStateToProps();
      const propsFromState = mapStateToProps(this.props);
      Logger.endLoggingMapStateToProps(InnerComp.name, propsFromState);
      const ObservedInnerComp = InnerComp;
      return (
        <ObservedInnerComp {...this.props} {...propsFromState} />
      );
    }
  }
  return observer(Hoc);
}

function mergeStaticMembers(SrcComp, DestComp) {
  hoistNonReactStatics(DestComp, SrcComp);
}

function injectPrototype(Comp, wrappedComponent) {
  Object.getOwnPropertyNames(Comp.prototype).forEach((proto) => {
    if (!wrappedComponent.prototype[proto]) {
      wrappedComponent.prototype[proto] = Comp.prototype[proto];
    }
  });
}

module.exports = {
  connect
};
