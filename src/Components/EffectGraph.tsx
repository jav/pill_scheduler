import React from 'react';

import { Svg, G, Rect } from 'react-native-svg';

import { useComponentSize } from '../Functions/useComponentSize';

import AdministrationList from '../Types/AdministrationList';

import { View } from 'react-native';


interface Props {
    administrationList: AdministrationList;
    currentTime: Date;
}

export const EffectGraph = (props: Props) => {


    const [size, onLayout] = useComponentSize({ width: 100, height: 100 });
    const margin = 10;
    const SVGHeight = size.height;
    const SVGWidth = size.width;
    const graphHeight = SVGHeight - margin;
    const graphWidth = SVGWidth - margin;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={onLayout}>
            <Svg width={size.height} height={size.width}>
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
            </Svg>
        </View>
    );
}
