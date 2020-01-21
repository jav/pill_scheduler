import React from 'react';

import { Text } from 'react-native';

interface CurrentTimeProps {
    currentTime: Date
}

export const CurrentTime = (props: CurrentTimeProps) => {

    return (
        <Text> Current time: {props.currentTime.toString()}
        </Text>
    );
}