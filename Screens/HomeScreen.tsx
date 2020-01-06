import React from 'react';

import { reducer, initialState, addAdministration } from '../Context/Context';


import { Button } from 'react-native-material-ui';
import { ActionButtonFixShadowRadiusNANBug as ActionButton } from '../Components/ActionButtonFixShadowRadiusNANBug';
import { StyleSheet, Text, View } from 'react-native';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props { }

export const HomeScreen = (props: Props) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const paracetamolKey = 'Paracetamol';
    const NSAIDKey = 'NSAID';

    function handlePillAdd(pillName) {
        if ([paracetamolKey, NSAIDKey].includes(pillName)) {
            dispatch(addAdministration(pillName));
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActionButton onPress={(pillName) => handlePillAdd(pillName)}
                actions={
                    [
                        { icon: < Icon key={paracetamolKey} name="pill" size={30} color="#fff" />, label: "Paracteamol-label" },
                        { icon: < Icon key={NSAIDKey} name="pill" size={30} color="#fff" />, label: "NSAID" },
                    ]
                }
                transition="speedDial"
                icon={<Icon name="pill" size={30} color="#fff" />}
            />
            <Text>
                Home Screen
            </Text>
            <Text>
                Administration list
                        List: {
                    state.administrations.length > 0 ?
                        state.administrations.map((e, i) => <Text key={i}>{e.pill}</Text>) :
                        <Text>List is empty</Text>}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});