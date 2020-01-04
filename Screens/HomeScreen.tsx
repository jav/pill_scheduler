import React, { useContext } from 'react';

import { AppContext } from '../Context/Context';

import { StyleSheet, Text, View, Button } from 'react-native';

class Props { }

export const HomeScreen = (props: Props) => {
    const { counter, list } = useContext(AppContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>


            <Text>
                Counter: {counter},
                        List: {
                    list.length > 0 ?
                        list.map((e) => <Text key={e}>{e}</Text>) :
                        <Text>List is empty</Text>}
            </Text>
            <Button title="Append" onPress={() => { }} />
            <Button title="Prepend" onPress={() => { }} />
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