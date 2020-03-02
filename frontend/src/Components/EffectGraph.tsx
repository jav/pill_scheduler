import React from 'react';

import { G, Svg, Text as SVGText, Line } from 'react-native-svg';
import Path from './animated-path'

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
    const graphHeight = SVGHeight - margin*6;
    const graphWidth = SVGWidth - margin;

    const animationDuration = 100;
    const order = shape.stackOrderNone;
    const offset = shape.stackOffsetNone;
    const curve = shape.curveMonotoneX;
    const xScale = scale.scaleLinear;

    const xTimes: number[] = [];
    let xLabels: string[] = [];
    const endTime = moment(props.currentTime).add(6, 'hours').add(1, 'minute').startOf('minute').valueOf();
    const startTime = moment(props.currentTime).subtract(12, 'hours').startOf('minute').valueOf();

    const keys = ['Paracetamol', 'NSAID'];
    const colors = ['rgb(38, 210, 30, 0.75)', 'rgb(73, 51, 255, 0.75)'];

    let i: number;
    let nowIndex = 0;
    for (i = startTime; i <= endTime; i = moment(i).add(15, 'minutes').valueOf()) {
        xTimes.push(i);
        xLabels.push(i % (8 * 60 * 1000) === 0 ? moment(i).format("HH") : "");
        if (props.currentTime > moment(i).toDate()) nowIndex = xTimes.length;
    }
    //console.log("xLabels.length:", xLabels.filter((e)=>e!=="").length);
    const data = xTimes.map((t) => ({
        time: t,
        Paracetamol: props.administrationList.getEffectAtTime(t, 'Paracetamol'),
        NSAID: props.administrationList.getEffectAtTime(t, 'NSAID')
    }))

    const x = xScale()
        .domain([0, xTimes.length])
        .range([margin, graphWidth])
        .clamp(true)

    const y = scale
        .scaleLinear()
        .domain([0, 3])
        .range([graphHeight, margin])
        .clamp(true)

    const series = shape
        .stack()
        .keys(keys)
        .order(order)
        .offset(offset)(data);

    const areas = series.map((serie, index) => {
        const path = shape
            .area()
            .x((d, index) => {
                return x(index);
            })
            .y0((d) => y(d[0]))
            .y1((d) => y(d[1]))
            .curve(curve)(data.map((_, index) => [serie[index][0], serie[index][1]]))

        return {
            path,
            key: keys[index],
            color: colors[index],
        }
    })

    return (
        <View style={{ flex: 1, height: 400, width: 300 }}>
            <View style={{ flex: 1 }} onLayout={(event) => onLayout(event)}>
                {SVGHeight > 0 && SVGWidth > 0 && (
                    <Svg style={{ height: SVGHeight, width: SVGWidth }}>
                        <G>
                            {areas.map((area, index) => (
                                <Path
                                    key={area.key}
                                    fill={area.color}
                                    animate={true}
                                    animationDuration={animationDuration}
                                    d={area.path}
                                />
                            ))}
                        </G>
                        <G >
                            {xLabels.map((t, i) =>
                                (
                                    t !== "" ? <SVGText
                                        key={i}
                                        textAnchor={'middle'}
                                        x={x(i)}
                                        y={y(2)}
                                    >
                                        {t}
                                    </SVGText> : null
                                )
                            )}
                        </G>
                        <G>
                            <Line x1={x(nowIndex)} y1={y(2)} x2={x(nowIndex)} y2={y(0)} stroke="black" strokeWidth="1"
                                strokeDasharray="5,5" />
                            <SVGText
                                textAnchor={'middle'}
                                x={x(nowIndex)}
                                y={y(0.0)}
                            >
                                Now
                            </SVGText>
                        </G>
                    </Svg>
                )}
            </View>
        </View>
    );
}
