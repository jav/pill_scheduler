import React, { useState } from 'react';
import { AppContext, setRealtimeClockMode, updateClock } from '../Context/Context';

import { CurrentTime } from '../Components/CurrentTime';

import { Text, View, Switch, Button, Platform } from 'react-native';
import DateTimePicker ,{IOSNativeProps, AndroidNativeProps} from '@react-native-community/datetimepicker';

interface Props { }

export const EditTimeScreen = (props: Props) => {
    const { state, dispatch } = React.useContext(AppContext);

    const { time } = state;

    const [mode, setMode] = useState<IOSNativeProps['mode']| AndroidNativeProps['mode']>('date');
    const [show, setShow] = useState(false);

    const showPicker = (timeOrDate: IOSNativeProps['mode']| AndroidNativeProps['mode']) => {
        setMode(timeOrDate);
        setShow(true); // possible race condition? I'm betting on that setShow() never executes noticably before setMode()
    }

    const setDate = (event, date) => {
        date = date || this.state.date;
        setShow(Platform.OS === 'ios' ? true : false)
        dispatch(updateClock(date));
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Edit Time Screen
            </Text>
            <Switch onValueChange={e => dispatch(setRealtimeClockMode(e))} value={state.realtimeClockMode} />
            <CurrentTime currentTime={time} />

            <View>
                <View>
                    <Button onPress={() => showPicker('date')} title="Show date picker!" />
                </View>
                <View>
                    <Button onPress={() => showPicker('time')} title="Show time picker!" />
                </View>
                {show && <DateTimePicker value={time}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={(e, d) => setDate(e, d)} />
                }
            </View>


        </View>
    );
}

class ModalScreen extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 30 }}>This is a modal!</Text>
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="Dismiss"
          />
        </View>
      );
    }
  }
