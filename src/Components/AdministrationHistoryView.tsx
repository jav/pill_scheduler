import React from 'react';

import AdministrationList from '../Types/AdministrationList';

import moment from 'moment';

import { Text, View, TouchableOpacity } from 'react-native';
import Administration from '../Types/Administration';
import { substanceDB } from '../Types/Substance';
import { NavigationStackProp } from 'react-navigation-stack';
import { pillsDB, Pill } from '../Types/Pill';
import { putAdministration } from '../Context/Context';

interface AdministrationHistoryViewPropsProps {
    administrationList: AdministrationList
    currentTime: Date
    editAdministration: (e:Administration)=>void
}


export const AdministrationHistoryView = (props: AdministrationHistoryViewPropsProps) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
                props.administrationList.length() > 0 ?
                    props.administrationList.administrationList
                        .filter((e) => moment(e.time).diff(moment(props.currentTime), 'hours') <= 24)
                        .map((e, i) => (
                            <TouchableOpacity key={i} onPress={() => props.editAdministration(e)} >

                                <Text key={i}>{e.pill.name} :{e.dose}mg : {moment(e.time).from(props.currentTime)}</Text>
                            </TouchableOpacity>
                        ))
                    :
                    <Text>List is empty</Text>}
        </View>
    );
}