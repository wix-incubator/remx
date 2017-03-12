import _ from 'lodash';
import React, { Component } from 'react';

export function connect(observerFunc) {
  return (mapStateToPropsOrComponent) => {
    if (isMapStateToProps(mapStateToPropsOrComponent)) {
      return wrappingComponent(mapStateToPropsOrComponent);
    } else {
      return observerFunc(mapStateToPropsOrComponent);
    }
  };
}

function wrappingComponent(mapStateToProps) {
  return (Comp) => (props) => {
    const obj = mapStateToProps();
    return (
      <Comp {...props} {...obj} />
    );
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
