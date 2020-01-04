import React from 'react';

import { AppContextConsumer } from '../Context/Context';

import { StyleSheet, Text, View, Button } from 'react-native';

class Props { }

export const HomeScreen = (props: Props) => {
    return (
        <AppContextConsumer>
            {appContext =>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Home Screen</Text>


                    <Text>
                        Counter: {appContext.counter},
                        List: {
                            appContext.list.length > 0 ?
                                appContext.list.map((e) => <Text key={e}>{e}</Text>) :
                                <Text>List is empty</Text>}
                    </Text>
                    <Button title="Append" onPress={() => { }} />
                    <Button title="Prepend" onPress={() => { }} />
                </View>
            }
        </AppContextConsumer>
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