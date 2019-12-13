import { renderReporter, trackComponents } from 'mobx-react/custom';

const loggers = [];
let isLoggerEnabled = false;
let isBuffering = false;
let buffer = [];
const actions = {
  setter: 'setter',
  getter: 'getter',
  mapStateToProps: 'mapStateToProps',
  componentRender: 'componentRender'
};

export function registerLoggerForDebug(logger) {
  if (loggers.length === 0) {
    console.warn('Remx logger has been activated. make sure to disable it in production.');
    activateRenderComponentSpy();
    isLoggerEnabled = true;
  }
  loggers.push(logger);
}

function log(data) {
  if (isBuffering) {
    buffer.push(data);
  } else {
    loggers.forEach((logger) => logger(data));
  }
}

export function logSetter(setterName, args) {
  if (isLoggerEnabled) {
    log({ action: actions.setter, name: setterName, args });
  }
}

export function logGetter(getterName, args) {
  if (isLoggerEnabled) {
    log({ action: actions.getter, name: getterName, args });
  }
}

export function startLoggingMapStateToProps() {
  isBuffering = true;
}

export function endLoggingMapStateToProps(connectedComponentName, returnValue) {
  isBuffering = false;
  if (isLoggerEnabled) {
    log({ action: actions.mapStateToProps, connectedComponentName, returnValue, triggeredEvents: buffer });
  }
  buffer = [];
}

function activateRenderComponentSpy() {
  trackComponents();
  renderReporter.on((data) => {
    const componentName = data.component.originalComponentName ? data.component.originalComponentName : data.component.constructor.name;
    log({ action: actions.componentRender, name: componentName });
  });
}
