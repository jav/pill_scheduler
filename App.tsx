import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { HomeScreen } from './Screens/HomeScreen'

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

// you can set your style right here, it'll be propagated to application
const uiTheme = {
  palette: {
    primaryColor: COLOR.green500,
  },
  toolbar: {
    container: {
      height: 50,
    },
  },
};


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});


const AppContainer = createAppContainer(AppNavigator);

export default () => (
  <ThemeContext.Provider value={getTheme(uiTheme)}>
    <AppContainer />
  </ThemeContext.Provider>
)

