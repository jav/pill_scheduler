import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';
import { AppContext, addAdministration } from '../Context/Context';
import moment from 'moment';

import { Text, View, Button, Picker } from 'react-native';

interface Props {
    navigation: NavigationStackProp<{ addNSAID: (a: string) => {} }>;
}

const NSAIDList = [
    'ibuprofen',
    'acetylicacid',
    'diklofenak',
]


export const NSAIDPickerScreen = (props: Props) => {
    const [pill, setPill] = React.useState(NSAIDList[0]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Select NSAID
            </Text>
            <View style={{ alignSelf: "stretch" }} >
                <Picker
                    selectedValue={pill}
                    onValueChange={(itemValue, itemIndex) => {
                        setPill(itemValue)
                    }
                    }>
                    {NSAIDList.map((pillName, i) => (<Picker.Item key={i} label={pillName} value={pillName} />))}
                </Picker>
            </View>
            <Button
                onPress={() => {
                    const addNSAID = props.navigation.getParam('addNSAID', (a: string) => { });
                    props.navigation.state.params.addNSAID(
                        pill
                    )
                    props.navigation.goBack()
                }}
                title="OK"
            />
            <Button
                onPress={() => props.navigation.goBack()}
                title="Dismiss"
            />
        </View>
    );
}
