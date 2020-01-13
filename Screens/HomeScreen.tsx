import React from 'react';
import { addAdministration, AppContext, updateClock } from '../Context/Context';
import { NavigationStackProp } from 'react-navigation-stack';

import { ActionButtonFixShadowRadiusNANBug as ActionButton } from '../Components/ActionButtonFixShadowRadiusNANBug';
import { AdministrationHistoryView } from '../Components/AdministrationHistoryView';
import { CurrentTime } from '../Components/CurrentTime';
import { CountdownTimers } from '../Components/CountdownTimers';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
    navigation: NavigationStackProp<{}>;
}


export const HomeScreen = (props: Props) => {
    const { state, dispatch } = React.useContext(AppContext);

    const { time, administrations } = state;
    const paracetamolKey = 'Paracetamol';
    const NSAIDKey = 'NSAID';

    function handlePillAdd(time, pillName) {
        if ([paracetamolKey, NSAIDKey].includes(pillName)) {
            dispatch(addAdministration(time, pillName));
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Home Screen
            </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('EditTime')} >
                <CurrentTime currentTime={time} />
            </TouchableOpacity>
            <CountdownTimers administrationList={administrations} currentTime={time} />
            <AdministrationHistoryView administrationList={administrations} currentTime={time} />
            <ActionButton onPress={(pillName) => handlePillAdd(time, pillName)}
                actions={
                    [
                        { icon: < Icon key={paracetamolKey} name="pill" size={30} color="#fff" />, label: "Paracteamol-label" },
                        { icon: < Icon key={NSAIDKey} name="pill" size={30} color="#fff" />, label: "NSAID" },
                    ]
                }
                transition="speedDial"
                icon={<Icon name="pill" size={30} color="#fff" />}
            />
        </View>
    );
}
