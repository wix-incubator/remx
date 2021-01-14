/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { connect } from 'remx';
import {
  Button,
  StyleSheet, Text, View
} from 'react-native';
import { incCount, decCount } from './stores/actions';

import { store } from './stores/store';

const App: () => React$Node = ({ count }) => {
  return (
    <View>
      <Button title="inc" onPress={() => incCount()} />
      <Text style={styles.text}>{count}</Text>
      <Button title="dec" onPress={() => decCount()} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center'
  }
});

function mapStateToProps(ownProps) {
  return {
    count: store.getCount()
  };
}

export default connect(mapStateToProps)(App);
