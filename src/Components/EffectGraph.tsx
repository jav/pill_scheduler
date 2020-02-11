import React from 'react';

import { StackedAreaChart, Grid } from 'react-native-svg-charts';

import * as shape from 'd3-shape';

import { useComponentSize } from '../Functions/useComponentSize';

import AdministrationList from '../Types/AdministrationList';

import { View } from 'react-native';
import moment from 'moment';

interface Props {
    administrationList: AdministrationList;
    currentTime: Date;
}

export const EffectGraph = (props: Props) => {


    const [size, onLayout] = useComponentSize({ width: 100, height: 100 });
    const margin = 2;
    const SVGHeight = size.height;
    const SVGWidth = size.width;
    const graphHeight = SVGHeight - margin;
    const graphWidth = SVGWidth - margin;

    const xTimes: Date[] = [];
    const endTime = moment(props.currentTime).add(0.5, 'hours').add(1, 'minute').startOf('minute');
    const startTime = moment(props.currentTime).subtract(2, 'hours').startOf('minute');

    let i: moment.Moment;
    for (i = startTime; i <= endTime; i = moment(i).add(15, 'minutes')) {
        xTimes.push(i.toDate());
    }

    const data = xTimes.map((t) => ({
        time: t,
        Paracetamol: props.administrationList.getEffectAtTime(t, 'Paracetamol'),
        NSAID: props.administrationList.getEffectAtTime(t, 'NSAID')
    }))



    const colors = ['rgb(38, 210, 30, 0.75)', 'rgb(73, 51, 255, 0.75)'];
    const keys = ['Paracetamol', 'NSAID'];

    return (
        <View style={{ flexDirection: 'row', height: 200 }}>
            <StackedAreaChart
                style={{ flex: 1, background: 'black' }}
                contentInset={{ top: 10, bottom: 10 }}
                data={data}
                keys={keys}
                colors={colors}
                curve={shape.curveNatural}
            >
                <Grid />
            </StackedAreaChart>
        </View>
    );
}
