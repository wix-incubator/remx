import React from 'react';
import renderer from 'react-test-renderer';
import * as remx from '../es6Remx/remx';
import Store from './Store';
import MyComponent from './MapStateToPropsComp';
import { connect } from '../es6Remx/connect';

describe(`connect with mapStateToProps`, () => {
  let renderSpy;
  let store;
  let registerLoggerForDebug;
  beforeEach(() => {
    store = new Store(remx);
    renderSpy = jest.fn();
    registerLoggerForDebug = remx.registerLoggerForDebug;
  });

  afterEach(() => {
    delete global.__mobxInstanceCount; // prevent warnings
  });

  it('defensive coding', () => {
    expect(connect({})).toBeDefined();
  });

  it('connected component behaves normally', () => {
    const mapStateToProps = () => {
      return {};
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(
      <MyConnectedComponent renderSpy={renderSpy} textToRender="hello" />,
    );
    expect(tree.toJSON().children).toEqual(['hello']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('connected props are merged with pass props', () => {
    const mapStateToProps = () => {
      return {
        textToRender: 'Hello, World!'
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(
      <MyConnectedComponent renderSpy={renderSpy} />,
    );
    expect(tree.toJSON().children).toEqual(['Hello, World!']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('object will be injected to props', () => {
    const mapStateToProps = () => {
      return {
        textToRender: 'Hello, World!'
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(
      <MyConnectedComponent renderSpy={renderSpy} />,
    );
    expect(tree.toJSON().children).toEqual(['Hello, World!']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('wraps with observer that observes mapStateToProps', () => {
    const mapStateToProps = () => {
      return {
        textToRender: store.getters.getName()
      };
    };
    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);
    const tree = renderer.create(
      <MyConnectedComponent renderSpy={renderSpy} />,
    );
    expect(tree.toJSON().children).toEqual(['nothing']);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    store.setters.setName('my name');
    expect(tree.toJSON().children).toEqual(['my name']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
    store.setters.setName('my name2');
    expect(tree.toJSON().children).toEqual(['my name2']);
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('passes ownProps into mapStateToProps', () => {
    const mapStateToProps = (ownProps) => {
      const textToRender = store.getters.getName() + ownProps.otherProp;
      return {
        textToRender
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(
      <MyConnectedComponent renderSpy={renderSpy} otherProp="123" />,
    );
    expect(tree.toJSON().children).toEqual(['nothing123']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setName('my name');
    expect(tree.toJSON().children).toEqual(['my name123']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('connected component has same static members as original component', () => {
    const mapStateToProps = () => {
      return {};
    };
    const MyConnectedComponent = connect(mapStateToProps())(MyComponent);
    expect(MyConnectedComponent.staticMember).toEqual('a static member');
  });

  it('should trigger logger when mapStateToProps called', () => {
    const spy = jest.fn();
    const mapStateToProps = () => {
      return {
        textToRender: store.getters.getName()
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);
    registerLoggerForDebug(spy);
    renderer.create(<MyConnectedComponent someOwnProp="someOwnProp" />);
    const expectedTriggerEvents = [
      { action: 'getter', args: [], name: 'getName' }
    ];
    expect(spy.mock.calls[0][0]).toEqual({
      action: 'mapStateToProps',
      connectedComponentName: 'MyComponent',
      triggeredEvents: expectedTriggerEvents,
      returnValue: { textToRender: 'nothing' }
    });
    spy.mockClear();
    store.setters.setName('bla');
    expect(spy.mock.calls[1][0]).toEqual({
      action: 'mapStateToProps',
      connectedComponentName: 'MyComponent',
      triggeredEvents: expectedTriggerEvents,
      returnValue: { textToRender: 'bla' }
    });
  });

  it('connected components received connected props', () => {
    const mapStateToProps = () => {
      return {
        textToRender: 'text'
      };
    };

    const result = [];

    class Comp extends React.Component {
      constructor(props) {
        super(props);
        result.push(props.textToRender);
      }
      render() {
        return 'ok';
      }
    }

    const MyConnectedComponent = connect(mapStateToProps)(Comp);
    renderer.create(<MyConnectedComponent />);
    expect(result).toEqual(['text']);
  });

  it('Triggers update on deep mutation', () => {
    store.setters.addProduct('123', { title: 'InitialTitle' });

    const mapStateToProps = () => {
      return {
        product: store.getters.getProduct('123')
      };
    };

    const MyConnectedComponent = connect(mapStateToProps)(MyComponent);

    const tree = renderer.create(
      <MyConnectedComponent renderSpy={renderSpy} />,
    );

    expect(tree.toJSON().children).toEqual(['InitialTitle']);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    store.setters.setProductTitle('123', 'New');

    expect(tree.toJSON().children).toEqual(['New']);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });
});
