import React from 'react';

import Administration from '../Types/Administration';
import AdministrationList from '../Types/AdministrationList';
import { nextParacetamol, nextNSAID } from '../Functions/nextPill';
import moment from 'moment'

import ProgressBar from 'react-native-progress/Bar';

import { Text, View } from 'react-native';
import { Substance } from '../Types/Substance';

interface CountdownTimersProps {
    administrationList: AdministrationList
    currentTime: Date
}

export const CountdownTimers = (props: CountdownTimersProps) => {

    const timeToNextParacetamol = (administrationList: AdministrationList, currentTime: Date): string => {
        let next = moment(nextParacetamol(administrationList, currentTime));
        let duration = moment.duration(next.diff(currentTime))
        if (duration < moment.duration(0))
            return "Now!";
        else return duration.humanize();
    }

    const timeToNextNSAID = (administrationList: AdministrationList, substance: Substance, currentTime: Date): string => {
        let next = moment(nextNSAID(administrationList, currentTime)[substance]);
        let duration = moment.duration(next.diff(currentTime))
        if (duration < moment.duration(0))
            return "Now!";
        else return duration.humanize();
    }

    const progressToNextParacetamol = (administrationList, currentTime) => {
        const timeDiff = moment.duration(moment(nextParacetamol(administrationList, currentTime)).diff(currentTime)).asHours();
        return Math.max(0, Math.min(1, timeDiff / 4));
    }
    const progressToNextNSAID = (administrationList, currentTime) => {
        const nextNSAIDTimes = nextNSAID(administrationList, currentTime);
        const minTime = Object.keys(nextNSAIDTimes)
            .map((key) => nextNSAIDTimes[key])
            .reduce((min, curr) => moment.min(moment(min), moment(curr)).toDate());
        const timeDiff = moment.duration(moment(minTime).diff(moment(currentTime))).asHours();
        return Math.max(0, Math.min(1, timeDiff / 6));
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ProgressBar progress={progressToNextParacetamol(props.administrationList, props.currentTime)} width={200} />
            <Text>
                Paracetamol: {timeToNextParacetamol(props.administrationList, props.currentTime)}
            </Text>
            <ProgressBar progress={progressToNextNSAID(props.administrationList, props.currentTime)} width={200} />
            <Text>
                Acetylic acid: {timeToNextNSAID(props.administrationList, Substance.ACETYLICACID, props.currentTime)}
            </Text>
            <Text>
                Diklofenak: {timeToNextNSAID(props.administrationList, Substance.DIKLOFENAK, props.currentTime)}
            </Text>
            <Text>
                Ibuprofen: {timeToNextNSAID(props.administrationList, Substance.IBUPROFEN, props.currentTime)}
            </Text>
        </View>
    );
}
