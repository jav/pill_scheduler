import React from 'react';

import Administration from '../Types/Administration';
import AdministrationList from '../Types/AdministrationList';
import { nextParacetamol } from '../Functions/nextPill';
import moment from 'moment'

import ProgressBar from 'react-native-progress/Bar';

import { Text, View } from 'react-native';

interface CountdownTimersProps {
    administrationList: AdministrationList
    currentTime: Date
}

export const CountdownTimers = (props: CountdownTimersProps) => {

    const displayNextParacetamol = (administrationList: AdministrationList, currentTime: Date) => {
        if (administrationList.getInterval(moment(currentTime).subtract(24,'hours').toDate(), currentTime).length() <= 0) {
            return "Now";
        }
        else {
            return moment(nextParacetamol(administrationList, currentTime)).from(currentTime);
        }
    }

    const displayNextNSAID = (administrationList, currentTime) => {
        if (administrationList < currentTime) {
            return "Now";
        }
        else {
            return moment(nextNSAID(administrationList, currentTime)).from(currentTime);
        }
    }

    const progressToNextPill = (administrationList, currentTime) => {
        const timeDiff = moment.duration(moment(nextParacetamol(administrationList, currentTime)).diff(currentTime)).asHours();

        if(timeDiff < 0)
            return 0;
        if(timeDiff > 4)
            return 1;
        return timeDiff/4;

    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ProgressBar progress={progressToNextPill(props.administrationList, props.currentTime)} width={200} />
            <Text>{
                displayNextParacetamol(props.administrationList, props.currentTime)
            }</Text>
            <ProgressBar progress={progressToNextPill(props.administrationList, props.currentTime)} width={200} />
            <Text>{
                displayNextParacetamol(props.administrationList, props.currentTime)
            }</Text>
        </View>
    );
}
