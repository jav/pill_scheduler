import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';

import { AppContext, setRealtimeClockMode } from '../Context/Context';

import { CurrentTime } from '../Components/CurrentTime';

import { Text, View, Switch, Button } from 'react-native';

interface Props {
    navigation: NavigationStackProp<{}>;
}

export const EditTimeScreen = (props: Props) => {
    const { state, dispatch } = React.useContext(AppContext);
    const { time } = state;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Edit Time Screen
            </Text>
            <CurrentTime currentTime={time} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Realtime mode </Text>
                <Switch onValueChange={e => dispatch(setRealtimeClockMode(e))} value={state.realtimeClockMode} />
            </View>
            <Button onPress={() => props.navigation.navigate('MyModal', { mode: 'date' })} title="Show date picker!" />
            <Button onPress={() => props.navigation.navigate('MyModal', { mode: 'time' })} title="Show time picker!" />
        </View>
    );
}
