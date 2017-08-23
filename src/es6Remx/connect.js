import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

export const connect = (mapStateToProps) => {
  if (_.isFunction(mapStateToProps)) {
    return wrapWithObserverHigherOrderComponent(mapStateToProps);
  } else {
    return observer;
  }
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
