/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';

import SimpleContainer from './src/containers/SimpleContainer';
import startup from './src/startup';

class ReduxPipelineNativeExamples extends Component {
  componentWillMount() {
    startup();
  }
  render() {
    return (
      <View style={styles.container}>
        <SimpleContainer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('ReduxPipelineNativeExamples', () => ReduxPipelineNativeExamples);
