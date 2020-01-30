import React from 'react';
import { addAdministration, AppContext, updateClock } from '../Context/Context';
import { NavigationStackProp } from 'react-navigation-stack';

import { ActionButtonFixShadowRadiusNANBug as ActionButton } from '../Components/ActionButtonFixShadowRadiusNANBug';
import { AdministrationHistoryView } from '../Components/AdministrationHistoryView';
import { CurrentTime } from '../Components/CurrentTime';
import { CountdownTimers } from '../Components/CountdownTimers';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Pill, Substance } from '../Types/Pill';

interface Props {
    navigation: NavigationStackProp<{}>;
}


export const HomeScreen = (props: Props) => {
    const { state, dispatch } = React.useContext(AppContext);

    const { time, administrationList: administrations } = state;
    const paracetamolKey = 'Paracetamol';
    const NSAIDKey = 'NSAID';

    function handlePillAdd(time: Date, pillName: string) {
        if (pillName === paracetamolKey) {
            dispatch(addAdministration(time, new Pill('paracetamol', Substance.PARACETAMOL), 500));
        }
        if (pillName === NSAIDKey) {
            props.navigation.navigate('PickNSAIDModal', {
                addNSAID: (pillName: string) => {
                    let substance: Substance = Substance.IBUPROFEN;
                    let dose: number = 0;
                    switch (pillName.toUpperCase()) {

                        case 'ACETYLICACID':
                            substance = Substance.ACETYLICACID;
                            dose = 1000;
                            break;
                        case 'DIKLOFENAK':
                            substance = Substance.DIKLOFENAK;
                            dose = 25;
                            break;
                        case 'IBUPROFEN':
                        default:
                            substance = Substance.IBUPROFEN;
                            dose = 400;
                            break;
                    }
                    dispatch(addAdministration(time, new Pill(pillName, substance), dose));
                }
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
