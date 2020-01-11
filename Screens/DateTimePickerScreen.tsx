import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';
import { AppContext, updateClock } from '../Context/Context';

import { Text, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  navigation: NavigationStackProp<{ mode: string }>;
}

export const DateTimePickerScreen = (props: Props) => {

  const { state, dispatch } = React.useContext(AppContext);
  const { time } = state;

  const setDate = (e, date) => {
    dispatch(updateClock(date));
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Set {props.navigation.getParam('mode')}</Text>
      <View style={{ alignSelf: "stretch" }} >
        <DateTimePicker value={time}
          mode={props.navigation.getParam('mode')}
          is24Hour={true}
          display="default"
          onChange={(e, d) => setDate(e, d)} />
      </View>
      <Button
        onPress={() => props.navigation.goBack()}
        title="Dismiss"
      />
    </View>
  );
}
