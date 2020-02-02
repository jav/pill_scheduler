import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';

import { pillsDB } from '../Types/Pill';
import { Text, View, Button, Picker } from 'react-native';

interface Props {
    navigation: NavigationStackProp<{
        addNSAID: (a: Pill) => {},
        returnKey: string
    }>
}

const NSAIDList = pillsDB.getAllNSAID().map((p => p.name));



export const NSAIDPickerScreen = (props: Props) => {
    const [pillName, setPill] = React.useState(NSAIDList[0]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Select NSAID
            </Text>
            <View style={{ alignSelf: "stretch" }} >
                <Picker
                    selectedValue={pillName}
                    onValueChange={(itemValue) => setPill(itemValue)}
                >
                    {NSAIDList.map((pillName, i) => (<Picker.Item key={i} label={pillName} value={pillName} />))}
                </Picker>
            </View>
            <Button
                onPress={() => {
                    props.navigation.navigate({
                        routeName: 'PickDoseModal',
                        params: {
                            defaultDose: pillsDB.getPill(pillName).defaultDose,
                            doseList: pillsDB.getPill(pillName).doseList,
                            pickDose: (_doseMg: number): void => {
                                const pill = pillsDB.getPill(pillName);
                                props.navigation.state.params.addNSAID(pill, _doseMg);
                            },
                            returnKey: props.navigation.state.params.returnKey
                        },
                    });
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
