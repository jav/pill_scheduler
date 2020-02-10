import React from 'react';

import { Svg, G, Path, Rect } from 'react-native-svg';

import * as array from 'd3-array';
import * as scale from 'd3-scale';
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

    const xTimes: number[] = [];
    const endTime = moment(props.currentTime).add(0.5, 'hours').add(1, 'minute').startOf('minute');
    const startTime = moment(props.currentTime).subtract(2, 'hours').startOf('minute');

    let i: moment.Moment;
    for (i = startTime; i <= endTime; i = moment(i).add(15, 'minutes')) {
        xTimes.push(i.valueOf());
    }

    const data = xTimes.map((t) => ({
        time: t,
        Paracetamol: props.administrationList.getEffectAtTime(t, 'Paracetamol'),
        NSAID: props.administrationList.getEffectAtTime(t, 'NSAID')
    }))

    const keys = ["Paracetamol", "NSAID"];

    const x = scale.scaleLinear()
        .domain(array.extent(xTimes))
        .range([margin, SVGWidth - margin]);

    const y = scale
        .scaleLinear()
        .domain([0, 1])
        .range([SVGHeight - margin, SVGHeight / 2 + margin]);

    const series = shape
        .stack()
        .keys(keys)(data);
    //.order(order)
    //.offset(offset);

    const color = ['green', 'blue'];

    const areas = series.map((serie, index) => {
        const path = shape
            .area()
            .x((_, index) =>
                x(


                    xTimes[index]
                )
            )
            .y0((d) => y(d[0]))
            .y1((d) => y(d[1]))(serie.map((e) => [e[0], e[1]]));

        return {
            path,
            key: keys[index],
            color: color[index]
        }
    });
    console.log("areas:", areas);
    console.log("domain:", array.extent(xTimes));

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={onLayout}>
            <Svg width={size.height} height={size.width}             >
                <G y={graphHeight}>
                    <Rect
                        x={margin / 2}
                        y={margin / 2 - graphHeight}
                        width={graphWidth}
                        height={graphHeight}
                        stroke="red"
                        strokeWidth="4"
                        fill="yellow"
                    />
                </G>
                {areas.map((area, index) => (
                    <Path
                        key={area.key}
                        d={area.path}
                        fill={area.color}
                        stroke="black"
                        strokeWidth="1"
                    />
                ))}
            </Svg>
        </View>
    );
}
