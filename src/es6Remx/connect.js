import _ from 'lodash';
import React from 'react';
import { observer } from '../mobxReactClone'; // should import from mobx-react/custom when they fix issue #319

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
  const hoc = (props) => {
    const propsFromState = mapStateToProps(props);
    const ObservedInnerComp = observer(InnerComp);
    return (
      <ObservedInnerComp {...props} {...propsFromState} />
    );
  };
  return observer(hoc);
}

module.exports = {
  connect
};
