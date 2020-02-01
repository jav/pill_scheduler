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
        let dose = 0;
        if (pillName === paracetamolKey) {
            console.log("navigate to PickDoseModal");
            props.navigation.navigate('PickDoseModal', {
                defaultDose:1000,
                doseList: [250, 325, 500, 650, 750, 1000],
                pickDose: (_doseMg: number): void => {
                    dispatch(addAdministration(time, new Pill('paracetamol', Substance.PARACETAMOL), _doseMg));
                }
            })
        }
        if (pillName === NSAIDKey) {
            props.navigation.navigate('PickNSAIDModal', {
                addNSAID: (pillName: string) => {
                    let substance: Substance = Substance.IBUPROFEN;
                    let defaultDose: number = 0;
                    let doseList = [];
                    switch (pillName.toUpperCase()) {

                        case 'ACETYLICACID':
                            substance = Substance.ACETYLICACID;
                            defaultDose = 1000;
                            doseList = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
                            break;
                        case 'DIKLOFENAK':
                            substance = Substance.DIKLOFENAK;
                            defaultDose = 25,
                            doseList = [25, 50, 75, 100];
                            break;
                        case 'IBUPROFEN':
                        default:
                            substance = Substance.IBUPROFEN;
                            defaultDose = 400;
                            doseList = [100, 200, 300, 400, 500, 600, 700, 800];
                            break;
                    }
                    props.navigation.navigate('PickDoseModal', {
                        defaultDose: defaultDose,
                        doseList: doseList,
                        pickDose: (_doseMg: number): void => {
                            dispatch(addAdministration(time, new Pill(pillName, substance), _doseMg));
                        }
                    })
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
