import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';

import { Pill, pillsDB } from '../Types/Pill';
import { Text, View, Button, Picker, TouchableOpacity } from 'react-native';

interface Props {
    navigation: NavigationStackProp<{
        pillOptions: Pill[],
        addPill: (p: Pill, dose: number) => void,
        returnKey: string,
        remove?: boolean,
        deletePill?: () => void
    }>
}

export const PillPickerScreen = (props: Props) => {
    const pillOptions: Pill[] = props.navigation.state.params.pillOptions;
    const addPill: (p: Pill, dose: number) => void = props.navigation.state.params.addPill;
    const returnKey: string = props.navigation.state.params.returnKey;
    const remove: boolean = props.navigation.state.params.remove || false;
    const deletePill = props.navigation.state.params.deletePill;
    const [pillName, setPill] = React.useState(pillOptions[0].name);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Select Pill
            </Text>
            <View style={{ alignSelf: "stretch" }} >
                <Picker
                    selectedValue={pillName}
                    onValueChange={(itemValue) => setPill(itemValue)}
                >
                    {pillOptions.map((pill, i) => (<Picker.Item key={i} label={pill.name} value={pill.name} />))}
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
                                addPill(pill, _doseMg);
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
            {remove && (
                <View>
                    <View><Text></Text></View><View><Text></Text></View><View><Text></Text></View>
                    <View><Text></Text></View><View><Text></Text></View><View><Text></Text></View>
                    <View>
                        <TouchableOpacity onPress={() => {
                            deletePill();
                            props.navigation.goBack(returnKey);

                        }}>
                            <Text>DELETE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
