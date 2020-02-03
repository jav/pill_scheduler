import React from 'react';

import Administration from '../Types/Administration';
import AdministrationList from '../Types/AdministrationList';
import moment from 'moment'
import { Text, View } from 'react-native';
import { SubstanceKey, substanceDB } from '../Types/Substance';

interface Props {
    administrationList: AdministrationList
    currentTime: Date
}

export const EffectGraph = (props: Props) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <Text>
                Effect graph            </Text>
        </View>
    );
}
