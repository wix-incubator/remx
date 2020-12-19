import React from 'react';
import * as remx from '../es6Remx';

import { Text } from '../utils/testUtils';

const renderText = (txt) => (
  <Text>
    {txt}
  </Text>
);

export default (props) => {
  const mapStateToProps = props.mapStateToProps ?
    props.mapStateToProps :
    () => ({
      productTitle: props.store.getters.getProduct('123') && props.store.getters.getProduct('123').title,
      dynamicObject: props.store.getters.getDynamicObject(),
      name: props.store.getters.getName()
    });

  const dependencies = props.dependenciesSelector ?
    props.dependenciesSelector(props) :
    undefined;

  const connectedProps = remx.useConnect(mapStateToProps, dependencies);

  if (props.renderSpy) {
    props.renderSpy();
  }

  if (connectedProps.productTitle) {
    return renderText(connectedProps.productTitle);
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
