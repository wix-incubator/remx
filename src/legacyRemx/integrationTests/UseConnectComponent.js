import React from 'react';
import { Text } from 'react-native';
import { useConnect } from '..';

const renderText = (txt) => (
  <Text>
    {txt}
  </Text>
);

const MyComponent = (props) => {
  const mapStateToProps = props.mapStateToProps ?
    props.mapStateToProps :
    () => ({
      product: props.store.getters.getProduct('123'),
      dynamicObject: props.store.getters.getDynamicObject(),
      name: props.store.getters.getName()
    });

  const dependencies = props.dependenciesSelector ?
    props.dependenciesSelector(props) :
    undefined;

  const connectedProps = useConnect(mapStateToProps, dependencies);

  if (props.renderSpy) {
    props.renderSpy();
  }

  if (connectedProps.product) {
    return renderText(connectedProps.product.title);
  } else if (props.testDynamicObject) {
    /* istanbul ignore next */
    return renderText(
      typeof connectedProps.dynamicObject === 'string' ?
        connectedProps.dynamicObject :
        JSON.stringify(connectedProps.dynamicObject),
    );
  }
  return renderText(connectedProps.name);
};

export default MyComponent;
