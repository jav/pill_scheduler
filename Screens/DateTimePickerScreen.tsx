import React, { useState } from 'react';
import { NavigationStackProp } from 'react-navigation-stack';
import { AppContext, setRealtimeClockMode, updateClock } from '../Context/Context';

import { CurrentTime } from '../Components/CurrentTime';

import { Text, View, Button, Platform } from 'react-native';
import DateTimePicker ,{IOSNativeProps, AndroidNativeProps} from '@react-native-community/datetimepicker';

interface Props {
  navigation: NavigationStackProp<{}>;
}

export const DateTimePickerScreen = (props:Props) => {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button
        onPress={() => props.navigation.goBack()}
        title="Dismiss"
      />
    </View>
  );

}