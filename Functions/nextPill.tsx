import Administration from '../Types/Administration';

import moment from 'moment'

export const nextParacetamol = (paracetamolList: Administration[], currentTime: Date) => {
    /* 
    Paracetamol
    Maximum 4g per 24h
    Maximum 1g per 4h
    */

    const last24hList = paracetamolList
        .filter((a) => a.pill.toLowerCase() === 'Paracetamol'.toLowerCase())
        .filter((a) => a.time)
        .filter((a) => moment(a.time).diff(moment(currentTime), 'hours') <= 24);

    if (last24hList.length === 0) return moment(0).toDate();

    const totalmg = last24hList.reduce((acc, a) => acc + 500, 0);

    const oldestAdministration = last24hList[last24hList.length - 1];
    if (totalmg >= 4000) {
        return moment(oldestAdministration.time).add(24, 'hours').toDate();
    }

    const latestAdministration = last24hList[0];
    return moment(latestAdministration.time).add(4, 'hours').toDate();
}

export const nextNSAID = (NSAIDList: Administration[]) => {

}
