import React from 'react';

import moment from 'moment';

import { putAdministration, removeAdministration, AppContext } from '../Context/Context';
import { NavigationStackProp } from 'react-navigation-stack';

import { ActionButtonFixShadowRadiusNANBug as ActionButton } from '../Components/ActionButtonFixShadowRadiusNANBug';
import { AdministrationHistoryView } from '../Components/AdministrationHistoryView';
import { CurrentTime } from '../Components/CurrentTime';
import { CountdownTimers } from '../Components/CountdownTimers';
import { EffectGraph } from '../Components/EffectGraph';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { registerForPushNotificationsAsync } from '../Functions/notificationTest';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Pill, pillsDB } from '../Types/Pill';
import Administration from '../Types/Administration';

interface Props {
    navigation: NavigationStackProp<{}>;
}


export const HomeScreen = (props: Props) => {
    registerForPushNotificationsAsync();
    const { state, dispatch } = React.useContext(AppContext);

    const { time, administrationList: administrations } = state;
    const paracetamolKey = 'Paracetamol';
    const NSAIDKey = 'NSAID';
    const TestKey = 'TestKey';

    function putParacetamol(time: Date, uuid: null | string) {
        props.navigation.navigate('PickDoseModal', {
            defaultDose: pillsDB.getPill('Paracetamol').defaultDose,
            doseList: pillsDB.getPill('Paracetamol').doseList,
            pickDose: (_doseMg: number): void => {
                const pill = pillsDB.getPill('Paracetamol')
                dispatch(putAdministration(time, pill, _doseMg, uuid));
            }
        })
    }

    function putNSAID(time: Date, uuid: null | string) {
        props.navigation.navigate({
            routeName: 'PickPillModal',
            params: {
                pillOptions: pillsDB.getAllNSAID(),
                addPill: (pill: Pill, _doseMg: number) => {
                    dispatch(putAdministration(time, pill, _doseMg, uuid));
                },
                returnKey: 'returnNavigationKey'
            },
            key: 'returnNavigationKey'
        });
    }

    function putAny(time: Date, uuid: null | string) {
        props.navigation.navigate({
            routeName: 'PickPillModal',
            params: {
                pillOptions: pillsDB.getAll(),
                addPill: (pill: Pill, _doseMg: number) => {
                    dispatch(putAdministration(time, pill, _doseMg, uuid));
                },
                returnKey: 'returnNavigationKey',
                remove: true,
                deletePill: ()=>dispatch(removeAdministration(uuid))
            },
            key: 'returnNavigationKey'
        });
    }

    function handlePillAdd(time: Date, pillKey: string) {
        if (pillKey === paracetamolKey) {
            putParacetamol(time, null)
        }
        if (pillKey === NSAIDKey) {
            putNSAID(time, null)
        }
        if (pillKey == TestKey) {
            const paraetamolPill = pillsDB.getPill('Paracetamol');
            const ibuprofenPill = pillsDB.getPill('Ibuprofen');
            dispatch(putAdministration(moment().subtract(24, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(20, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(16, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(12, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(8, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(4, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(0, 'hours').toDate(), paraetamolPill, paraetamolPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(24, 'hours').toDate(), ibuprofenPill, ibuprofenPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(18, 'hours').toDate(), ibuprofenPill, ibuprofenPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(12, 'hours').toDate(), ibuprofenPill, ibuprofenPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(6, 'hours').toDate(), ibuprofenPill, ibuprofenPill.defaultDose, null));
            dispatch(putAdministration(moment().subtract(0, 'hours').toDate(), ibuprofenPill, ibuprofenPill.defaultDose, null));
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
            <EffectGraph administrationList={administrations} currentTime={time} />
            <CountdownTimers administrationList={administrations} currentTime={time} />
            <AdministrationHistoryView administrationList={administrations} currentTime={time} editAdministration={(a) => putAny(a.time, a.uuid)} />
            <ActionButton onPress={(pillName) => handlePillAdd(time, pillName)}
                actions={
                    [
                        { icon: < Icon key={paracetamolKey} name="pill" size={30} color="#fff" />, label: "Paracteamol-label" },
                        { icon: < Icon key={NSAIDKey} name="pill" size={30} color="#fff" />, label: "NSAID" },
                        { icon: < Icon key={TestKey} name="pill" size={30} color="#fff" />, label: "Test setup" },
                    ]
                }
                transition="speedDial"
                icon={<Icon name="pill" size={30} color="#fff" />}
            />
        </View>
    );
}
