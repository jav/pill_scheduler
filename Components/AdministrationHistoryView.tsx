import React from 'react';

import Administration from '../Types/Administration';

import moment from 'moment'

import { Text, View } from 'react-native';

interface AdministrationHistoryViewPropsProps {
    administrationList: Administration[]
    currentTime: Date
}

export const AdministrationHistoryView = (props: AdministrationHistoryViewPropsProps) => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {
                props.administrationList.length > 0 ?
                    props.administrationList.map((e, i) => (
                        <View key={i}>

                            <Text>{e.pill} : {moment(e.time).from(props.currentTime)}</Text>
                        </View>
                    )) :
                    <Text>List is empty</Text>}
        </View>
    );
}

interface AdministrationHistoryViewEntryProps {
    administration: Administration
    currentTime: Date
}

const AdministrationEntry = (props: AdministrationHistoryViewEntryProps) => {
    return (
        <Text> time : </Text>
    )
}