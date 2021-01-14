import isFunction from 'lodash.isfunction';
import React from 'react';
import { observer } from './observer';
import * as Logger from './logger';
import { warnOnceWithCode } from '../utils/console';
import hoistNonReactStatics from 'hoist-non-react-statics';

const connect = (mapStateToProps) => {
  if (isFunction(mapStateToProps)) {
    return wrapWithObserverHigherOrderComponent(mapStateToProps);
  }
  warnOnceWithCode(
        'connect-without-mapstatetoprops',
        '[remx] connect()(component) is deprecated, use observer(component) instead'
    );
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
        <
                ObservedInnerComp {...this.props}
          {...propsFromState}
        />
      );
    }
    }
  return observer(Hoc);
}

function mergeStaticMembers(SrcComp, DestComp) {
  hoistNonReactStatics(DestComp, SrcComp);
}

module.exports = {
  connect
};
