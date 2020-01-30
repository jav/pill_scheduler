import Administration from '../Types/Administration';
import AdministrationList from '../Types/AdministrationList';

import moment from 'moment'

export const roundTime = (currentTime: Date, clockResolution: number) => {
    const currentTimestamp = currentTime.getTime();
    return new Date(Math.floor(currentTimestamp / clockResolution) * clockResolution);
}

