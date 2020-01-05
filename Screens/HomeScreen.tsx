import React from 'react';

import { reducer, initialState } from '../Context/Context';

import { Button } from 'react-native-material-ui';
import { ActionButtonFixShadowRadiusNANBug as ActionButton } from '../Components/ActionButtonFixShadowRadiusNANBug';
import { StyleSheet, Text, View } from 'react-native';

interface Props { }

export const HomeScreen = (props: Props) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActionButton />
            <Text>Home Screen</Text>
            <Text>
                Administration list
                        List: {
                    state.administrations.length > 0 ?
                        state.administrations.map((e, i) => <Text key={i}>{e.pill}</Text>) :
                        <Text>List is empty</Text>}
            </Text>
            <Button raised primary text="Append" onPress={() => dispatch({ type: 'addAdministration' })} />
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