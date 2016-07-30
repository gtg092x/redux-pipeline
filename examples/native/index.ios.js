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

import startup from './src/startup';

import SimpleContainer from './src/containers/SimpleContainer';

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
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('ReduxPipelineNativeExamples', () => ReduxPipelineNativeExamples);
