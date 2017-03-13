import _ from 'lodash';
import React, { Component } from 'react';

export function connect(observerFunc) {
  return (mapStateToProps) => {
    if (_.isFunction(mapStateToProps)) {
      return wrapWithObserverHigherOrderComponent(observerFunc, mapStateToProps);
    } else {
      return observerFunc;
    }
  };
}

function wrapWithObserverHigherOrderComponent(observerFunc, mapStateToProps) {
  return (Comp) => {
    return observerOnMapStateToProps(Comp, mapStateToProps, observerFunc);
  };
}

function observerOnMapStateToProps(InnerComp, mapStateToProps, observerFunc) {
  const hoc = (props) => {
    const propsFromState = mapStateToProps(props);
    return (
      <InnerComp {...props} {...propsFromState} />
    );
  };
  return observerFunc(hoc);
}
