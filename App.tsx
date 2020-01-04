import React from 'react';
import Store from './Context/Store';

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

  return (<Store>
    <AppContainer />
  </Store>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
