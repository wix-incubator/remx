import React from 'react';
import * as mobx from 'mobx';
import * as Logger from './logger';
import useUpdate from '../utils/useUpdate';

/**
 * Default value [] for dependencies doesn't match other React hooks behaviour,
 * but in the most cases it is desired, so it's sane default
 */
const useConnect = (mapStateToProps, dependencies = []) => {
  const [mutableState] = React.useState({});
  const update = useUpdate();

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
        update,
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

  /* istanbul ignore if  */
  if (!Object.prototype.hasOwnProperty.call(mutableState, 'returnValue')) {
    // Sometimes mobx reactions may be delayed, TODO: figure out why
    return mapStateToProps();
  }

  return mutableState.returnValue;
};

module.exports = {
  useConnect
};
