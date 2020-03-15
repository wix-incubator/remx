import React from 'react';
import { Text } from 'react-native';

const renderText = (txt) => (
  <Text>
    {txt}
  </Text>
);

export default (remx) => (props) => {
  const { productId, store } = props;
  const product = remx.useRemxValue(store.getters.getProduct, productId);
  const name = remx.useRemxValue(store.getters.getName);
  const dynamicObject = remx.useRemxValue(store.getters.getDynamicObject);

  if (props.renderSpy) {
    props.renderSpy();
  }

  return renderText(JSON.stringify({ name, dynamicObject, product }));
};
