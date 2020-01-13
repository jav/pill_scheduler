import React from 'react';

import Administration from '../Types/Administration';
import { nextParacetamol } from '../Functions/nextPill';
import moment from 'moment'

import ProgressBar from 'react-native-progress/Bar';

import { Text, View } from 'react-native';

interface CountdownTimersProps {
    administrationList: Administration[]
    currentTime: Date
}

export const CountdownTimers = (props: CountdownTimersProps) => {

    const displayNextParacetamol = (administrationList, currentTime) => {
        if (administrationList < currentTime) {
            return "Now";
        }
        else {
            return moment(nextParacetamol(administrationList, currentTime)).from(currentTime);
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{
                displayNextParacetamol(props.administrationList, props.currentTime)
            }</Text>
        </View>
    );
}
