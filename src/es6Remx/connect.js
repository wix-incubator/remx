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
      Logger.startBuffering();
      const propsFromState = mapStateToProps(this.props);
      const triggeredEvents = Logger.endBuffring();
      Logger.log({ action: Logger.actions.MAP_STATE_TO_PROPS, connectedComponentName: InnerComp.name, returnValue: propsFromState, triggeredEvents });
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
