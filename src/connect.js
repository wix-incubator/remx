import _ from 'lodash';
import React, { Component } from 'react';

export function connect(observerFunc) {
  return (mapStateToProps) => {
    if (_.isFunction(mapStateToProps)) {
      return receiveCompWrapWithObserverHigherOrderComponent(observerFunc, mapStateToProps);
    } else {
      return observerFunc;
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
