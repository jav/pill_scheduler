import React from 'react';
import { addAdministration, AppContext, updateClock } from '../Context/Context';
import { NavigationStackProp } from 'react-navigation-stack';

import { ActionButtonFixShadowRadiusNANBug as ActionButton } from '../Components/ActionButtonFixShadowRadiusNANBug';
import { AdministrationHistoryView } from '../Components/AdministrationHistoryView';
import { CurrentTime } from '../Components/CurrentTime';
import { CountdownTimers } from '../Components/CountdownTimers';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Pill, Substance, pillsDB } from '../Types/Pill';

interface Props {
    navigation: NavigationStackProp<{}>;
}


export const HomeScreen = (props: Props) => {
    const { state, dispatch } = React.useContext(AppContext);

    const { time, administrationList: administrations } = state;
    const paracetamolKey = 'Paracetamol';
    const NSAIDKey = 'NSAID';

    function handlePillAdd(time: Date, pillKey: string) {
        if (pillKey === paracetamolKey) {
            props.navigation.navigate('PickDoseModal', {
                defaultDose: pillsDB.getPill('Paracetamol').defaultDose,
                doseList: pillsDB.getPill('Paracetamol').doseList,
                pickDose: (_doseMg: number): void => {
                    const pill = pillsDB.getPill('Paracetamol')
                    dispatch(addAdministration(time, pill, _doseMg));
                }
            })
        }
        if (pillKey === NSAIDKey) {
            props.navigation.navigate({
                routeName: 'PickNSAIDModal',
                params: {
                    addNSAID: (pill: Pill, dose: number) => {
                        dispatch(addAdministration(time, pill, dose));
                    },
                    returnKey: 'returnNavigationKey'
                },
                key: 'returnNavigationKey'
            });
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
