import AdministrationList from '../Types/AdministrationList';

import moment from 'moment'
import { Substance } from '../Types/Pill';

interface NextPillMap {
    [key: string]: Date
}

export const nextParacetamol = (paracetamolList: AdministrationList, currentTime: Date) => {
    /*
    Paracetamol
    Maximum 4g per 24h
    Maximum 1g per 4h
    */

    const last24hList = paracetamolList.onlyParacetamol().getInterval(moment(currentTime).subtract(24, 'hours').toDate(), currentTime)

    if (last24hList.length() === 0) return moment(0).toDate();

    const totalmg = last24hList.totalMg(Substance.PARACETAMOL);

    const oldestAdministration = last24hList[last24hList.length() - 1];
    if (totalmg >= 4000) {
        return moment(oldestAdministration.time).add(24, 'hours').toDate();
    }

    const latestAdministration = last24hList.getLatestAdministration();

    return moment(latestAdministration.time).add(4, 'hours').toDate();
}

export const nextNSAID = (NSAIDList: AdministrationList, currentTime: Date): NextPillMap => {
    /*
    NSAID
    Ibuprofen  400mg/6h 1200mg/24h
    Diklofenak 50mg/4h, 150mg/24h
    Acetylic acid 1000mg/4h 3000mg/24h
    */

    let retObj = {
        [Substance.ACETYLICACID]: moment(0).toDate(),
        [Substance.DIKLOFENAK]: moment(0).toDate(),
        [Substance.IBUPROFEN]: moment(0).toDate(),
    };

    const last24hList = NSAIDList.onlyNSAID().getInterval(moment(currentTime).subtract(24, 'hours').toDate(), currentTime)
    if (last24hList.length() === 0) {
        return retObj;
    }

    const latestAdministration = last24hList.getLatestAdministration();
    retObj = {
        [Substance.ACETYLICACID]: moment(latestAdministration.time).add(6, 'hours').toDate(),
        [Substance.DIKLOFENAK]: moment(latestAdministration.time).add(6, 'hours').toDate(),
        [Substance.IBUPROFEN]: moment(latestAdministration.time).add(6, 'hours').toDate(),
    };

    const totalmgAcetylicacid = last24hList.totalMg(Substance.ACETYLICACID);
    if (totalmgAcetylicacid > 3000) {
        const latestAcetylicacidAdministration = last24hList.filterOnSubstance(Substance.ACETYLICACID).getLatestAdministration();
        retObj[Substance.ACETYLICACID] = moment.max(moment(retObj[Substance.ACETYLICACID]), moment(latestAcetylicacidAdministration.time).add(24, 'hours') ).toDate()
    }
    const totalmgDiklofenak = last24hList.totalMg(Substance.DIKLOFENAK);
    if (totalmgDiklofenak > 150) {
        const latestDiklofenakAdministration = last24hList.filterOnSubstance(Substance.DIKLOFENAK).getLatestAdministration();
        retObj[Substance.DIKLOFENAK] = moment.max(moment(retObj[Substance.DIKLOFENAK]), moment(latestDiklofenakAdministration.time).add(24, 'hours') ).toDate()
    }

    const totalmgIbuprofen = last24hList.totalMg(Substance.IBUPROFEN);
    if (totalmgIbuprofen > 1200) {
        const latestIbuprofenAdministration = last24hList.filterOnSubstance(Substance.IBUPROFEN).getLatestAdministration();
        retObj[Substance.IBUPROFEN] = moment.max(moment(retObj[Substance.IBUPROFEN]), moment(latestIbuprofenAdministration.time).add(24, 'hours') ).toDate()
    }

    return retObj;
}
