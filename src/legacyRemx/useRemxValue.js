import React from 'react';
import * as mobx from 'mobx';
import * as Logger from './logger';
import useUpdate from '../utils/useUpdate';

const useRemxValue = (getter, ...params) => {
  const [mutableState] = React.useState({});
  const update = useUpdate();

  const dispose = React.useMemo(
    () =>
      mobx.reaction(
        () => {
          Logger.startLoggingMapStateToProps();
          mutableState.lastError = undefined;
          try {
            mutableState.returnValue = getter(...params);
          } catch (err) {
            console.warn(
              'Encountered an uncaught exception that was thrown in useRemx hook',
              err,
            );
            mutableState.lastError = err;
          }
          Logger.endLoggingMapStateToProps(
            'useRemx hook',
            mutableState.returnValue,
          );
          return mutableState.returnValue;
        },
        update,
        { fireImmediately: false },
      ),
    params,
  );

  if (mutableState.lastError) {
    throw mutableState.lastError;
  }

  /* istanbul ignore if  */
  if (mutableState.dispose && mutableState.dispose !== dispose) {
    mutableState.dispose();
  }

  mutableState.dispose = dispose;

  React.useEffect(() => () => mutableState.dispose(), []);

  /* istanbul ignore if  */
  if (!Object.prototype.hasOwnProperty.call(mutableState, 'returnValue')) {
    // Sometimes mobx reactions may be delayed, TODO: figure out why
    return getter(...params);
  }

  return mutableState.returnValue;
};

module.exports = {
  useRemxValue
};
