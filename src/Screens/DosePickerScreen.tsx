import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';

import { Text, View, Button, Picker } from 'react-native';

interface Props {
    navigation: NavigationStackProp<{
        defaultDose: number,
        doseList: number[],
        addDose: (a: number) => {}
    }>
}

export const DosePickerScreen = (props: Props) => {
    console.log("navigate to DosePickerScreen");
    const [dose, setDose] = React.useState(props.navigation.state.params.defaultDose);
    const doseList = props.navigation.state.params.doseList;
    console.log("state dose:", dose);
    console.log("doseList:", doseList);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Select Dose
            </Text>
            <View style={{ alignSelf: "stretch" }} >
                <Picker
                    selectedValue={dose}
                    onValueChange={(itemValue, itemIndex) => {
                        setDose(itemValue)
                    }
                    }>
                    {doseList.map((d:number, i) => (<Picker.Item key={i} label={String(d)} value={d} />))}
                </Picker>
            </View>
            <Button
                onPress={() => {
                    props.navigation.state.params.pickDose(dose);
                    props.navigation.goBack();
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
