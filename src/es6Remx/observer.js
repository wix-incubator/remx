import React, { Component, forwardRef } from 'react';
import {
  observer as mobxReactObserver,
  Observer as MobxReactObserver
} from 'mobx-react';
import { incrementRenderingObserverDepth, decrementRenderingObserverDepth } from './globalState';
import { noop } from '../utils/noop';

const ReactForwardRefSymbol =
  typeof forwardRef === 'function' && forwardRef(noop).$$typeof;

const isFunctionComponent = (component) =>
  typeof component === 'function' &&
  (!component.prototype || !component.prototype.render) &&
  !component.isReactClass &&
  !Object.prototype.isPrototypeOf.call(Component, component);

export default null;

export const observer = (component) => {
  // Unwrap forward refs into `<Observer>` component
  // we need to unwrap the render, because it is the inner render that needs to be tracked,
  // not the ForwardRef HoC
  if (
    ReactForwardRefSymbol &&
    component.$$typeof === ReactForwardRefSymbol
  ) {
    if (typeof component.render !== 'function') {
      throw new TypeError('render property of ForwardRef was not a function');
    }
    const render = makeRenderTrackable(component.render);
    return forwardRef(() => (
      <MobxReactObserver>
        {() => render.apply(undefined, arguments)}
      </MobxReactObserver>
    ));
  }

  if (isFunctionComponent(component)) {
    return mobxReactObserver(makeRenderTrackable(component));
  }

  component.prototype.render = makeRenderTrackable(component.prototype.render);
  return mobxReactObserver(component);
};

const makeRenderTrackable = (render) => function () {
  incrementRenderingObserverDepth();
  const result = render.apply(this, arguments);
  decrementRenderingObserverDepth();
  return result;
};
