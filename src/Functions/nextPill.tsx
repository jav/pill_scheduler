import Administration from '../Types/Administration';
import AdministrationList from '../Types/AdministrationList';

import moment from 'moment'

export const nextParacetamol = (paracetamolList: AdministrationList, currentTime: Date) => {
    /*
    Paracetamol
    Maximum 4g per 24h
    Maximum 1g per 4h
    */

    const last24hList = paracetamolList.onlyParacetamol().getInterval(moment(currentTime).subtract(24, 'hours').toDate(), currentTime)

    if (last24hList.length() === 0) return moment(0).toDate();

    const totalmg = last24hList.reduce((acc, a) => acc + 500, 0);

    const oldestAdministration = last24hList[last24hList.length - 1];
    if (totalmg >= 4000) {
        return moment(oldestAdministration.time).add(24, 'hours').toDate();
    }

    const latestAdministration = last24hList[0];
    return moment(latestAdministration.time).add(4, 'hours').toDate();
}

export const nextNSAID = (NSAIDList: Administration[], currentTime: Date) => {
    /*
    NSAID
    Ibuprofen  400mg/6h 1200mg/24h
    Diklofenak 50mg/4h, 150mg/24h
    Acetylic acid 1000mg/4h 3000mg/24h
    */

}
