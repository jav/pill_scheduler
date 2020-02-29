import React, { useMemo } from 'react';
import { useInterval } from './Functions/useInterval';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { AppContextProvider, reducer, initialState, updateClock } from './Context/Context';

import { HomeScreen } from './Screens/HomeScreen';
import { DateTimePickerScreen } from './Screens/DateTimePickerScreen';
import { EditTimeScreen } from './Screens/EditTimeScreen';
import { PillPickerScreen } from './Screens/PillPickerScreen';
import { DosePickerScreen } from './Screens/DosePickerScreen';
import { roundTime } from './Functions/roundTime';

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

const MainStackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    EditTime: {
      screen: EditTimeScreen
    }
  },
  {
    initialRouteName: 'Home',
  }
);

// Added for e.g modal screens
const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStackNavigator,
    },
    DateTimePickerModal: {
      screen: DateTimePickerScreen,
    },
    PickPillModal: {
      screen: PillPickerScreen,
    },
    PickDoseModal: {
      screen: DosePickerScreen,
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStackNavigator);


export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);


  const clockUpdateFrequency = 5000;
  const clockResolution = 15000;

  useInterval(() => {
    if (state.realtimeClockMode) {
      dispatch(
        updateClock(
          roundTime(new Date(), clockResolution)
        )
      );
    }
  }
    , clockUpdateFrequency
  )

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
