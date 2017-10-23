import _ from 'lodash';
import React from 'react';
import { observer } from '../mobxReactClone'; // should import from mobx-react/custom when they fix issue #319
import * as Logger from './logger';

const connect = (mapStateToProps) => {
  if (_.isFunction(mapStateToProps)) {
    return wrapWithObserverHigherOrderComponent(mapStateToProps);
  }
  return observer;
};

function wrapWithObserverHigherOrderComponent(mapStateToProps) {
  return (Comp) => {
    const wrappedComponent = observerOnMapStateToProps(Comp, mapStateToProps);
    _.forEach(_.keys(Comp), (key) => _.set(wrappedComponent, key, _.get(Comp, key)));
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

module.exports = {
  connect
};
