import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { HomeScreen } from './Screens/HomeScreen'

import { StyleSheet } from 'react-native';

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});


const AppContainer = createAppContainer(AppNavigator);

export default () => {

  return <AppContainer />;

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
