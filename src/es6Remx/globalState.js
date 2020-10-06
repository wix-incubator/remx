const globalState = {
  renderingObserverDepth: 0
};

export const incrementRenderingObserverDepth = () => globalState.renderingObserverDepth++;

export const decrementRenderingObserverDepth = () => globalState.renderingObserverDepth--;

export const isRenderingObserver = () => globalState.renderingObserverDepth > 0;
