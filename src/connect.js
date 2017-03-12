import _ from 'lodash';
import React, { Component } from 'react';

export function connect(observerFunc) {
  return (mapStateToPropsOrComponent) => {
    if (isMapStateToProps(mapStateToPropsOrComponent)) {
      return receiveCompWrapWithObserverHigherOrderComponent(observerFunc, mapStateToPropsOrComponent);
    } else {
      return observerFunc(mapStateToPropsOrComponent);
    }
  };
}

function receiveCompWrapWithObserverHigherOrderComponent(observerFunc, mapStateToProps) {
  return (Comp) => {
    const hoc = (props) => {
      const propsFromState = mapStateToProps(props);
      return (
        <Comp {...props} {...propsFromState} />
      );
    };
    return observerFunc(hoc);
  };
}

function isMapStateToProps(thing) {
  if (!_.isFunction(thing)) {
    return false;
  }
  try {
    const result = thing();
    return _.isPlainObject(result);
  } catch (e) {
    return false;
  }
}

    // return (Comp) => {
    //   const mapState = (stores) => Object.keys(mapStateToProps).reduce((result, key) => ({
    //     ...result,
    //     [key]: get(stores, mapStateToProps[key])
    //   }), {});

    //   const component = injectFunc((stores, props) => ({
    //     ...props,
    //     ...mapState(stores)
    //   }))(observerFunc(Comp));

    //   return component;
    // };
