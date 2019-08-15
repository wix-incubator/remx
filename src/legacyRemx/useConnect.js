import React from 'react';
import * as mobx from 'mobx';
import * as Logger from './logger';

/**
 * Default value [] for dependencies doesn't match other React hooks behaviour,
 * but in the most cases it is desired, so it's sane default
 */
const useConnect = (mapStateToProps, dependencies = []) => {
  const [mutableState] = React.useState({});
  const [, updateCounter] = React.useState(0);

  const dispose = React.useMemo(
    () =>
      mobx.reaction(
        () => {
          Logger.startLoggingMapStateToProps();
          mutableState.lastError = undefined;
          try {
            mutableState.returnValue = mapStateToProps();
          } catch (err) {
            console.warn(
              'Encountered an uncaught exception that was thrown by mapStateToProps in useConnect hook',
              err,
            );
            mutableState.lastError = err;
          }
          Logger.endLoggingMapStateToProps(
            'useConnect hook',
            mutableState.returnValue,
          );
          return mutableState.returnValue;
        },
        () => {
          updateCounter((counter) => counter + 1);
        },
        { fireImmediately: false },
      ),
    dependencies,
  );

  if (mutableState.lastError) {
    throw mutableState.lastError;
  }

  if (mutableState.dispose && mutableState.dispose !== dispose) {
    mutableState.dispose();
  }

  mutableState.dispose = dispose;

  React.useEffect(() => () => mutableState.dispose(), []);
  return mutableState.returnValue;
};

module.exports = {
  useConnect
};
