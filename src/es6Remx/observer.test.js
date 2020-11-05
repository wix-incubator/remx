import React from 'react';
import renderer from 'react-test-renderer';
import { observer } from './observer';
import { incrementRenderingObserverDepth, decrementRenderingObserverDepth } from './globalState';
import { grabConsole } from '../utils/testUtils';

jest.mock('./globalState', () => ({
  incrementRenderingObserverDepth: jest.fn(),
  decrementRenderingObserverDepth: jest.fn()
}));

describe('observer', () => {
  it('wraps render for FC', () => {
    const Comp = observer(() => null);
    const tree = renderer.create(
      <Comp />,
    );
    expect(tree.toJSON()).toEqual(null);
    expect(incrementRenderingObserverDepth).toHaveBeenCalledTimes(1);
    expect(decrementRenderingObserverDepth).toHaveBeenCalledTimes(1);
  });

  it('wraps render for FC', () => {
    const Comp = observer(React.forwardRef(() => null));
    const tree = renderer.create(
      <Comp />,
    );
    expect(tree.toJSON()).toEqual(null);
    expect(incrementRenderingObserverDepth).toHaveBeenCalledTimes(1);
    expect(decrementRenderingObserverDepth).toHaveBeenCalledTimes(1);
  });

  it('wraps render for CC', () => {
    const Comp = observer(class extends React.Component {
      render() {
        return null;
      }
    });
    const tree = renderer.create(
      <Comp />,
    );
    expect(tree.toJSON()).toEqual(null);
    expect(incrementRenderingObserverDepth).toHaveBeenCalledTimes(1);
    expect(decrementRenderingObserverDepth).toHaveBeenCalledTimes(1);
  });

  it('Throws error when trying to forward not a function', () => {
    expect(() => grabConsole(() => observer(React.forwardRef(undefined))))
      .toThrowError('render property of ForwardRef was not a function');
  });
});
