import React, { useRef, useMemo } from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { AppContextProvider, reducer, initialState, updateClock } from './Context/Context'

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
  }
});


const AppContainer = createAppContainer(AppNavigator);


export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // According to article (https://hswolff.com/blog/how-to-usecontext-with-usereducer/), passing in
  // value={state, dispatch} in AppContext.Provider create a new object if App is rerendered, triggering
  // a full stack re-render
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    < ThemeContext.Provider value={getTheme(uiTheme)} >
      <AppContextProvider value={contextValue}>
        <AppContainer />
      </AppContextProvider>
    </ThemeContext.Provider >)
}
