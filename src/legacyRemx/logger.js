import { renderReporter, trackComponents } from '../mobxReactClone';

const loggers = [];
let isBuffering = false;
let buffer = [];
export const actions = {
  SETTER: 'SETTER',
  GETTER: 'GETTER',
  MAP_STATE_TO_PROPS: 'MAP_STATE_TO_PROPS',
  COMPONENT_RENDER: 'COMPONENT_RENDER'
};

export function registerLogger(logger) {
  if (loggers.length === 0) {
    activateRenderComponentSpy();
  }
  loggers.push(logger);
}

export function log(data) {
  if (isBuffering) {
    buffer.push(data);
  } else {
    loggers.forEach((logger) => logger(data));
  }
}

export function startBuffering() {
  isBuffering = true;
}

export function endBuffring() {
  isBuffering = false;
  const result = buffer;
  buffer = [];
  return result;
}

function activateRenderComponentSpy() {
  trackComponents();
  renderReporter.on((data) => {
    const componentName = data.component.originalComponentName;
    log({ action: actions.COMPONENT_RENDER, name: componentName });
  });
}
