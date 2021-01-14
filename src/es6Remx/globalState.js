const globalState = {
  renderingObserverDepth: 0,
  accessStateStrictMode: false // should be set to true by default in future releases, comment from 4.0.0-rc.0
};

export const incrementRenderingObserverDepth = () => globalState.renderingObserverDepth++;

export const decrementRenderingObserverDepth = () => globalState.renderingObserverDepth--;

export const isRenderingObserver = () => globalState.renderingObserverDepth > 0;

export const setAccessStateStrictMode = (shouldCheck) => {
  globalState.accessStateStrictMode = Boolean(shouldCheck);
};

export const isAccessStateStrictMode = () => globalState.accessStateStrictMode;
