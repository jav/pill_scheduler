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
  },
});


const AppContainer = createAppContainer(AppNavigator);

class SingletonInterval {
  // TODO: Switch to useInterval() https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  private static instance: SingletonInterval = null;
  private intervalId: number;
  private static intervalHasBeenSet = false;

  public static getInstance(): SingletonInterval {
    if (!SingletonInterval.instance) {
      SingletonInterval.instance = new SingletonInterval();
    }
    return SingletonInterval.instance;
  }
  public setInterval(f: () => void, interval: number): boolean {
    if (SingletonInterval.intervalHasBeenSet) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => f(), interval);
    SingletonInterval.intervalHasBeenSet = true;
    return true;
  }

  public clearInterval(): void {
    clearInterval(this.intervalId);
  }
}

export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  let clockUpdateFrequency = 5000;
  let clockResolution = 15000;

  useRef(SingletonInterval.getInstance().setInterval(
    () => {
      dispatch(updateClock(
        new Date(
          Math.floor(new Date().getTime() / clockResolution) * clockResolution
        )
      ))
    }
    , clockUpdateFrequency));

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
